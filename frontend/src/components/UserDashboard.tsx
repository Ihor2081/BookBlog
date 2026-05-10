import { Eye, Heart, FileText, Edit, Trash2, ArrowLeft } from "lucide-react";
import type { Page } from "../types/navigation";

interface UserDashboardProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function UserDashboard({
  onBack,
  onNavigate,
}: UserDashboardProps) {
  const stats = [
    {
      label: "Total Posts",
      value: "12",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Likes",
      value: "234",
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Total Views",
      value: "1.2k",
      icon: Eye,
      color: "bg-green-100 text-green-600",
    },
  ];

  const userPosts = [
    {
      id: 1,
      title: "The Art of Deep Reading in the Digital Age",
      status: "published",
      views: 1247,
      likes: 89,
      date: "Apr 20, 2026",
      category: "Reading Tips",
    },
    {
      id: 2,
      title: "My Journey Through Classic Literature",
      status: "published",
      views: 842,
      likes: 67,
      date: "Apr 15, 2026",
      category: "Personal",
    },
    {
      id: 3,
      title: "Understanding Modern Poetry",
      status: "draft",
      views: 0,
      likes: 0,
      date: "Apr 22, 2026",
      category: "Poetry",
    },
    {
      id: 4,
      title: "Book Recommendations for Spring 2026",
      status: "published",
      views: 634,
      likes: 52,
      date: "Apr 10, 2026",
      category: "Recommendations",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 flex-1">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </button>

      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <img
            src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=200&h=200&fit=crop"
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sarah Mitchell
            </h1>

            <p className="text-gray-600 mb-4">
              Cognitive psychologist and reading researcher
            </p>

            <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>

                  <p className="text-sm text-gray-500">
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              My Posts
            </h2>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              + New Post
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-600 rounded-lg">
              All
            </button>

            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Published
            </button>

            <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Drafts
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {post.title}
                    </h3>

                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-600">
                      {post.category}
                    </span>

                    <span>•</span>

                    <span>{post.date}</span>

                    {post.status === "published" && (
                      <>
                        <span>•</span>

                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>

                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>

                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}