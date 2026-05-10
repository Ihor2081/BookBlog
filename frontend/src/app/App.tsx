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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const [posts, setPosts] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  // =========================================
  // CHECK AUTH
  // =========================================
  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      const payload = parseJwt(token);

      if (payload) {
        setIsLoggedIn(true);
        setUserRole(payload.is_admin ? "admin" : "user");
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
        console.error("Posts loading error", error);
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
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.access_token;

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
      alert(error?.response?.data?.detail || "Login failed");
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
      alert(error?.response?.data?.detail || "Register failed");
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
        return <LoginPage onLogin={handleLogin} />;

      case "register":
        return <RegisterPage onRegister={handleRegister} />;
      
      case "user-dashboard":
        return (
          <UserDashboard
            onBack={() => setCurrentPage("home")}
            onNavigate={setCurrentPage}
          />
        );

      case "admin-dashboard":
        return (
          <AdminDashboard
            onBack={() => setCurrentPage("home")}
            onNavigate={setCurrentPage}
          />
        );

      case "post":
        return (
          <PostDetail
            onBack={() => setCurrentPage("home")}
            onNavigate={setCurrentPage}
          />
        );

      case "about":
        return (
          <AboutPage
            onBack={() => setCurrentPage("home")}
            onNavigate={setCurrentPage}
          />
        );

      default:
        return (
          <main className="container mx-auto px-6 py-12">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="cursor-pointer"
                    onClick={() => setCurrentPage("post")}
                  >
                    <PostCard {...post} />
                  </div>
                ))}
              </div>
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

      <div className="flex-1">{renderPage()}</div>

      <Footer />
    </div>
  );
}