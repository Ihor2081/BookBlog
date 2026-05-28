import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import api from "../lib/api";
import { parseJwt } from "../lib/auth";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LoginPage } from "../components/LoginPage";
import { RegisterPage } from "../components/RegisterPage";
import { UserDashboard } from "../components/UserDashboard";
import { AdminDashboard } from "../components/AdminDashboard";
import { PostDetail } from "../components/PostDetail";
import { AboutPage } from "../components/AboutPage";
import { PostCard } from "../components/PostCard";

import type { Page } from "../types/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
  cover_image?: string | null;
  created_at: string;
  read_time?: string;
  views?: number;
  likes_count?: number;

  author?: {
    id: number;
    username: string;
  };

  category?: {
    id: number;
    name: string;
  } | null;

  tags?: {
    id: number;
    name: string;
  }[];
}

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<Page>("home");

  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPostId, setSelectedPostId] =
    useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [userRole, setUserRole] = useState<
    "admin" | "user" | null
  >(null);

  // =========================================
  // CHECK AUTH
  // =========================================
  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      const payload = parseJwt(token);

      if (payload) {
        setIsLoggedIn(true);

        setUserRole(
          payload.is_admin ? "admin" : "user"
        );
      }
    }
  }, []);

  // =========================================
  // FETCH POSTS
  // =========================================
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);

        const response = await api.get("/posts");

        setPosts(response.data);
      } catch (error) {
        console.error(
          "Posts loading error",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // =========================================
  // LOGIN
  // =========================================
  const handleLogin = async (
    email: string,
    password: string
  ) => {
    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token =
        response.data.access_token;

      Cookies.set("access_token", token, {
        expires: 7,
      });

      const payload = parseJwt(token);

      setIsLoggedIn(true);

      if (payload?.is_admin) {
        setUserRole("admin");

        setCurrentPage("admin-dashboard");
      } else {
        setUserRole("user");

        setCurrentPage("user-dashboard");
      }
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
          "Login failed"
      );
    }
  };

  // =========================================
  // REGISTER
  // =========================================
  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration successful");

      setCurrentPage("login");
    } catch (error: any) {
      alert(
        error?.response?.data?.detail ||
          "Register failed"
      );
    }
  };

  // =========================================
  // LOGOUT
  // =========================================
  const handleLogout = () => {
    Cookies.remove("access_token");

    setIsLoggedIn(false);

    setUserRole(null);

    setCurrentPage("home");
  };

  // =========================================
  // PAGES
  // =========================================
  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <LoginPage
            onLogin={handleLogin}
          />
        );

      case "register":
        return (
          <RegisterPage
            onRegister={handleRegister}
          />
        );

      case "user-dashboard":
        return (
          <UserDashboard
            onBack={() =>
              setCurrentPage("home")
            }
            onNavigate={setCurrentPage}
          />
        );

      case "admin-dashboard":
        return (
          <AdminDashboard
            onBack={() =>
              setCurrentPage("home")
            }
            onNavigate={setCurrentPage}
          />
        );

      case "post":
        return (
          <PostDetail
            postId={selectedPostId}
            onBack={() =>
              setCurrentPage("home")
            }
            onNavigate={setCurrentPage}
          />
        );

      case "about":
        return (
          <AboutPage
            onBack={() =>
              setCurrentPage("home")
            }
            onNavigate={setCurrentPage}
          />
        );

      default:
        return (
          <main className="container mx-auto px-6 py-12">
            {isLoading ? (
              <div className="text-center text-lg">
                Loading...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center text-gray-500">
                No posts found
              </div>
            ) : (
              <>
                {/* FEATURED POST */}
                <div className="mb-10">
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedPostId(
                        posts[0].id
                      );

                      setCurrentPage("post");
                    }}
                  >
                    <PostCard
                      variant="featured"
                      title={posts[0].title}
                      excerpt={posts[0].content}
                      author={{
                        name:
                          posts[0].author
                            ?.username ||
                          "Unknown",
                        avatar:
                          "https://i.pravatar.cc/150?img=3",
                      }}
                      date={new Date(
                        posts[0].created_at
                      ).toLocaleDateString()}
                      readTime={
                        posts[0].read_time ||
                        "1 min read"
                      }
                      views={
                        posts[0].views || 0
                      }
                      likes={
                        posts[0]
                          .likes_count || 0
                      }
                      category={
                        posts[0].category
                          ?.name ||
                        "General"
                      }
                      categoryColor="bg-blue-100 text-blue-700"
                      coverImage={
                        posts[0].cover_image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200"
                      }
                      || []
                      }
                    />
                  </div>
                </div>

                {/* POSTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts
                    .slice(1)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedPostId(
                            post.id
                          );

                          setCurrentPage(
                            "post"
                          );
                        }}
                      >
                        <PostCard
                          title={post.title}
                          excerpt={
                            post.content
                          }
                          author={{
                            name:
                              post.author
                                ?.username ||
                              "Unknown",
                            avatar:
                              "https://i.pravatar.cc/150?img=5",
                          }}
                          date={new Date(
                            post.created_at
                          ).toLocaleDateString()}
                          readTime={
                            post.read_time ||
                            "1 min read"
                          }
                          views={
                            post.views || 0
                          }
                          likes={
                            post.likes_count ||
                            0
                          }
                          category={
                            post.category
                              ?.name ||
                            "General"
                          }
                          categoryColor="bg-purple-100 text-purple-700"
                          coverImage={
                            post.cover_image ||
                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200"
                          }
                          tags={
                            post.tags?.map(
                              (tag) =>
                                tag.name
                            ) || []
                          }
                        />
                      </div>
                    ))}
                </div>
              </>
            )}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
      />

      <div className="flex-1">
        {renderPage()}
      </div>

      <Footer />
    </div>
  );
}