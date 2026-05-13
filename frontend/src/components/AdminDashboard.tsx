import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Plus,
  X,
} from "lucide-react";

import api from "../lib/api";

import type { Page } from "../types/navigation";

interface AdminDashboardProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  views: number;
  created_at: string;
  cover_image?: string;
  author?: {
    username: string;
  };
}

interface Stats {
  total_posts: number;
  total_users: number;
  total_views: number;
  published_posts: number;
  draft_posts: number;
}

interface Category {
  id: number;
  name: string;
}

export function AdminDashboard({
  onBack,
}: AdminDashboardProps) {

  // =========================================
  // STATE
  // =========================================

  const [stats, setStats] = useState<Stats | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [creatingPost, setCreatingPost] = useState(false);

  const [categories] = useState<Category[]>([
    { id: 1, name: "Fiction" },
    { id: 2, name: "Non-Fiction" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Science" },
  ]);

  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category_id: 1,
    tags: "",
    cover_image: "",
    status: "draft",
  });

  // =========================================
  // FETCH ADMIN DATA
  // =========================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, postsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/posts"),
      ]);

      setStats(statsRes.data);

      setPosts(postsRes.data);

    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // =========================================
  // CREATE POST
  // =========================================

  const handleCreatePost = async () => {
      if (!newPost.title.trim()) {
        alert("Title is required");
        return;
      }
      
      if (newPost.title.trim().length < 3) {
        alert("Title must contain at least 3 characters");
        return;
      }

      if (!newPost.content.trim()) {
        alert("Content is required");
        return;
      }
      
      if (newPost.content.trim().length < 10) {
        alert("Content must contain at least 10 characters");
        return;
      }

      try {
        setCreatingPost(true);

        const payload = {
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          category_id: Number(newPost.category_id),
          tags: newPost.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          cover_image: newPost.cover_image || null,
          status: newPost.status,
        };

        console.log("POST PAYLOAD:", payload);

        await api.post("/admin/posts", payload);

        setShowCreateModal(false);

        setNewPost({
          title: "",
          content: "",
          category_id: 1,
          tags: "",
          cover_image: "",
          status: "draft",
        });

        await fetchAdminData();

      } catch (error: any) {
        console.error("FULL ERROR:", error);

        if (error.response) {
          console.error(
            "BACKEND RESPONSE:",
            error.response.data
          );

          alert(
            error.response.data?.detail?.[0]?.msg ||
            "Failed to create post"
          );
        }

      } finally {
        setCreatingPost(false);
      }
  };  
    // } catch (error: any) {

    //   console.error(
    //     "Create post error:",
    //     error?.response?.data || error
    //   );

    //   alert(
    //     error?.response?.data?.detail ||
    //     "Failed to create post"
    //   );

    // } finally {
    //   setCreatingPost(false);
    // }
 

  // =========================================
  // DELETE POST
  // =========================================

  const handleDeletePost = async (postId: number) => {

    const confirmed = window.confirm(
      "Delete this post?"
    );

    if (!confirmed) return;

    try {

      await api.delete(`/admin/posts/${postId}`);

      setPosts((prev) =>
        prev.filter((post) => post.id !== postId)
      );

    } catch (error) {
      console.error("Delete post error:", error);
    }
  };

  // =========================================
  // TOGGLE STATUS
  // =========================================

  const handleToggleStatus = async (
    postId: number,
    currentStatus: string
  ) => {

    const newStatus =
      currentStatus === "published"
        ? "draft"
        : "published";

    try {

      await api.patch(
        `/admin/posts/${postId}/status`,
        {
          status: newStatus,
        }
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                status: newStatus as
                  | "draft"
                  | "published",
              }
            : post
        )
      );

    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-1">

      {/* SIDEBAR */}

      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">

        <div className="p-6 border-b border-gray-200">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              B
            </div>

            <span className="font-semibold text-lg">
              Admin Panel
            </span>

          </div>

        </div>

        <nav className="flex-1 p-4 space-y-2">

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium">
            <TrendingUp className="h-4 w-4" />
            Overview
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            <FileText className="h-4 w-4" />
            Posts
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100">
            <Users className="h-4 w-4" />
            Users
          </button>

        </nav>

      </aside>

      {/* MAIN */}

      <main className="flex-1 overflow-auto">

        <div className="container mx-auto px-6 py-8">

          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>

          {/* HEADER */}

          <div className="flex items-center justify-between mb-8">

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>

              <p className="text-gray-600">
                Manage blog platform content
              </p>

            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </button>

          </div>

          {/* STATS */}

          {stats && (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

              <div className="bg-white rounded-xl p-6 border">

                <p className="text-sm text-gray-500">
                  Total Posts
                </p>

                <p className="text-3xl font-bold">
                  {stats.total_posts}
                </p>

              </div>

              <div className="bg-white rounded-xl p-6 border">

                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <p className="text-3xl font-bold">
                  {stats.total_users}
                </p>

              </div>

              <div className="bg-white rounded-xl p-6 border">

                <p className="text-sm text-gray-500">
                  Total Views
                </p>

                <p className="text-3xl font-bold">
                  {stats.total_views}
                </p>

              </div>

              <div className="bg-white rounded-xl p-6 border">

                <p className="text-sm text-gray-500">
                  Published Posts
                </p>

                <p className="text-3xl font-bold">
                  {stats.published_posts}
                </p>

              </div>

            </div>
          )}

          {/* POSTS TABLE */}

          <div className="bg-white rounded-xl border overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold">
                Posts Management
              </h2>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Post
                    </th>

                    <th className="px-6 py-4 text-left">
                      Author
                    </th>

                    <th className="px-6 py-4 text-left">
                      Views
                    </th>

                    <th className="px-6 py-4 text-left">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y">

                  {posts.map((post) => (

                    <tr
                      key={post.id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          {post.cover_image && (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}

                          <div>

                            <p className="font-medium text-gray-900">
                              {post.title}
                            </p>

                            <p className="text-sm text-gray-500">
                              {post.slug}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-6 py-4">
                        {post.author?.username || "Admin"}
                      </td>

                      <td className="px-6 py-4">
                        {post.views}
                      </td>

                      <td className="px-6 py-4">

                        <button
                          onClick={() =>
                            handleToggleStatus(
                              post.id,
                              post.status
                            )
                          }
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            post.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {post.status === "published" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}

                          {post.status}

                        </button>

                      </td>

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeletePost(post.id)
                            }
                            className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

      {/* CREATE POST MODAL */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Create Post
              </h2>

              <button
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-4">

              {/* TITLE */}

              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    title: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* CONTENT */}

              <textarea
                placeholder="Post content"
                rows={8}
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    content: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* CATEGORY */}

              <select
                value={newPost.category_id}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    category_id: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >

                {categories.map((category) => (

                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>

                ))}

              </select>

              {/* COVER IMAGE */}

              <input
                type="text"
                placeholder="Cover image URL"
                value={newPost.cover_image}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    cover_image: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* IMAGE PREVIEW */}

              {newPost.cover_image &&
                 (newPost.cover_image.startsWith("http") ||
                   newPost.cover_image.startsWith("data:image")) && (
                    <img
                      src={newPost.cover_image}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-xl border"
                      onError={(e) => {
                         e.currentTarget.style.display = "none";
                      }}
                    />

              )}

              {/* TAGS */}

              <input
                type="text"
                placeholder="Tags separated by commas"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    tags: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              />

              {/* STATUS */}

              <select
                value={newPost.status}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-3"
              >

                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

              </select>

              {/* CREATE BUTTON */}

              <button
                onClick={handleCreatePost}
                disabled={creatingPost}
                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >

                {creatingPost
                  ? "Creating..."
                  : "Create Post"}

              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}