import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Plus,
  X,
  Edit,
  Trash2,
  MessageSquare, // Додано іконку для чату
} from "lucide-react";

import ChatComponent from "../components/ChatComponent";
import api from "../lib/api";

import type { Page } from "../types/navigation";

interface AdminDashboardProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

interface User {
  id: number;      
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
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
  content?: string;
  category_id?: number;
  tags?: string[] | string;
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

interface ChatRoom {
  user_id: string;
  username: string;
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
  const [updatingPost, setUpdatingPost] = useState(false);
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
  
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Додано "chats" до списку можливих вкладок
  const [activeTab, setActiveTab] = useState<
     "overview" | "posts" | "users" | "chats"
  >("overview");

  const [users, setUsers] = useState<User[]>([]);

  // Стейт для кімнат чату (перенесено з AdminChatPage)
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  // =========================================
  // FETCH ADMIN DATA
  // =========================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, postsRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/posts"),
        api.get("/admin/users"),
      ]);
      
      setStats(statsRes.data);
      setPosts(postsRes.data);
      setUsers(usersRes.data);

    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Завантаження кімнат чату, якщо вибрано вкладку "chats"
  useEffect(() => {
    if (activeTab === "chats") {
      api.get("/admin/chat-rooms")
        .then((res) => setRooms(res.data))
        .catch((err) => console.error("Failed to fetch chat rooms:", err));
    }
  }, [activeTab]);

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
          console.error("BACKEND RESPONSE:", error.response.data);
          alert(
            error.response.data?.detail?.[0]?.msg ||
            "Failed to create post"
          );
        }

      } finally {
        setCreatingPost(false);
      }
  };  
    
  const handleUpdatePost = async () => {
    if (!editingPost) return;

    if (!editingPost.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setUpdatingPost(true);

      const processedTags = typeof editingPost.tags === "string"
        ? editingPost.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : Array.isArray(editingPost.tags)
           ? editingPost.tags.map((t: any) => typeof t === 'object' ? t.name : t)
           : [];

      const payload = {
        title: editingPost.title.trim(),
        content: editingPost.content?.trim() || "",
        category_id: Number(editingPost.category_id || 1),
        tags: processedTags || [],
        cover_image: editingPost.cover_image || null,
        status: editingPost.status,
      };

      await api.put(`/admin/posts/${editingPost.id}`, payload);
      setShowEditModal(false);
      setEditingPost(null);
      await fetchAdminData();
    } catch (error: any) {
      console.error("Update post error:", error);
      alert(error.response?.data?.detail || "Failed to update post");
    } finally {
      setUpdatingPost(false);
    }
  };

  // =========================================
  // DELETE POST
  // =========================================

  const handleDeletePost = async (postId: number) => {
    const confirmed = window.confirm("Delete this post?");
    if (!confirmed) return;

    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
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
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      await api.patch(`/admin/posts/${postId}/status`, { status: newStatus });

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, status: newStatus as "draft" | "published" }
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
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              B
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
             onClick={() => setActiveTab("overview")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium ${
               activeTab === "overview" 
                 ? "bg-blue-50 text-blue-600" 
                 : "text-slate-600 hover:bg-slate-50"
             }`}
          >
             <TrendingUp className="h-4 w-4" />
             Overview
          </button>

          <button
             onClick={() => setActiveTab("posts")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === "posts" 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50"
             }`}
          >
             <FileText className="h-4 w-4" />
             Posts
          </button>

          <button
             onClick={() => setActiveTab("users")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === "users" 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50"
             }`}
          >
             <Users className="h-4 w-4" />
             Users
          </button>

          {/* НОВА ВКЛАДКА ДЛЯ ЧАТУ */}
          <button
             onClick={() => setActiveTab("chats")}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === "chats" 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50"
             }`}
          >
             <MessageSquare className="h-4 w-4" />
             Chats
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Залишаємо глобальну кнопку "Назад" та Хедер для всіх стандартних вкладок */}
        {activeTab !== "chats" ? (
          <div className="flex-1 overflow-auto container mx-auto px-6 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage blog platform content</p>
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
            {stats && activeTab === "overview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 border">
                  <p className="text-sm text-gray-500">Total Posts</p>
                  <p className="text-3xl font-bold">{stats.total_posts}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border">
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold">{stats.total_users}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border">
                  <p className="text-sm text-gray-500">Total Views</p>
                  <p className="text-3xl font-bold">{stats.total_views}</p>
                </div>
                <div className="bg-white rounded-xl p-6 border">
                  <p className="text-sm text-gray-500">Published Posts</p>
                  <p className="text-3xl font-bold">{stats.published_posts}</p>
                </div>
              </div>
            )}
            
            {/* USERS TABLE */}
            {activeTab === "users" && (
              <div className="bg-white rounded-xl border overflow-hidden">
                 <div className="p-6 border-b">
                   <h2 className="text-xl font-bold">Users Management</h2>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left">ID</th>
                          <th className="px-6 py-4 text-left">Username</th>
                          <th className="px-6 py-4 text-left">Email</th>
                          <th className="px-6 py-4 text-left">Role</th>
                          <th className="px-6 py-4 text-left">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <div className="font-medium text-gray-900">{user.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_admin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                                 {user.is_admin ? "Admin" : "User"}
                               </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                               {new Date(user.created_at).toLocaleDateString("uk-UA", { year: "numeric", month: "long", day: "numeric" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
            )}

            {/* POSTS TABLE */}
            {(activeTab === "posts" || activeTab === "overview") && (
              <div className="bg-white rounded-xl border overflow-hidden mt-4">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Posts Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left">Post</th>
                        <th className="px-6 py-4 text-left">Author</th>
                        <th className="px-6 py-4 text-left">Views</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {post.cover_image && (
                                <img src={post.cover_image} alt={post.title} className="w-16 h-16 rounded-lg object-cover" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">{post.title}</p>
                                <p className="text-sm text-gray-500">{post.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{post.author?.username || "Admin"}</td>
                          <td className="px-6 py-4">{post.views}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleStatus(post.id, post.status)}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                            >
                              {post.status === "published" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              {post.status}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                  onClick={() => {
                                    const tagsString = Array.isArray(post.tags) ? post.tags.join(", ") : "";
                                    setEditingPost({ ...post, tags: tagsString });
                                    setShowEditModal(true);
                                  }}
                                  className="p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                              >
                                  <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeletePost(post.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600">
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
            )}
          </div>
        ) : (
          /* ІНТЕГРОВАНА ПАНЕЛЬ ЧАТУ З ВАШОГО АДМІН-КОМПОНЕНТА */
          <div className="flex flex-1 h-full overflow-hidden">
            {/* Ліва панель чату: Список активних діалогів */}
            <div className="w-1/3 border-r bg-white p-4 overflow-y-auto h-full">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={onBack} className="p-1 rounded hover:bg-gray-100 lg:hidden">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h2 className="font-bold text-lg">Діалоги з користувачами</h2>
              </div>
              {rooms.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Немає активних кімнат</p>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.user_id}
                    onClick={() => setActiveRoomId(room.user_id)}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition text-sm ${
                      activeRoomId === room.user_id ? "bg-blue-100 font-semibold text-blue-700" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    🧑 {room.username} <span className="text-xs text-gray-400">(ID: {room.user_id})</span>
                  </button>
                ))
              )}
            </div>

            {/* Права панель чату: Вікно відкритого чату */}
            <div className="w-2/3 bg-white flex flex-col h-full">
              {activeRoomId ? (
                <ChatComponent roomId={activeRoomId} currentRole="admin" />
              ) : (
                <div className="flex flex-1 items-center justify-center p-6 bg-slate-50">
                  <p className="text-center text-gray-400">Оберіть користувача зі списку, щоб почати листування</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Create Post</h2>
              <button onClick={() => setShowCreateModal(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              <textarea
                placeholder="Post content"
                rows={8}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              <select
                value={newPost.category_id}
                onChange={(e) => setNewPost({ ...newPost, category_id: Number(e.target.value) })}
                className="w-full border rounded-lg px-4 py-3"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Cover image URL"
                value={newPost.cover_image}
                onChange={(e) => setNewPost({ ...newPost, cover_image: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              {newPost.cover_image && (newPost.cover_image.startsWith("http") || newPost.cover_image.startsWith("data:image")) && (
                <img
                  src={newPost.cover_image}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-xl border"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}
              <input
                type="text"
                placeholder="Tags separated by commas"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              />
              <select
                value={newPost.status}
                onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
                className="w-full border rounded-lg px-4 py-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                onClick={handleCreatePost}
                disabled={creatingPost}
                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {creatingPost ? "Creating..." : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* EDIT POST MODAL */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Post</h2>
              <button onClick={() => { setShowEditModal(false); setEditingPost(null); }}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  rows={8}
                  value={editingPost.content || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingPost.category_id || 1}
                  onChange={(e) => setEditingPost({ ...editingPost, category_id: Number(e.target.value) })}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingPost.cover_image || ""}
                  onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separated by commas)</label>
                <input
                  type="text"
                  value={typeof editingPost.tags === "string" ? editingPost.tags : ""}
                  onChange={(e) => setEditingPost({ ...editingPost, tags: e.target.value })}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingPost.status}
                  onChange={(e) => setEditingPost({ ...editingPost, status: e.target.value as "draft" | "published" })}
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <button
                onClick={handleUpdatePost}
                disabled={updatingPost}
                className="w-full py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {updatingPost ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}