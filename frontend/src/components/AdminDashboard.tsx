import { useEffect, useState } from "react";
import { Users, FileText, TrendingUp, Eye, Edit, Trash2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import api from "../lib/api"; // Імпорт вашого налаштованого axios
import type { Page } from "../types/navigation";
interface AdminDashboardProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

// Мапа іконок для динамічних статистичних даних
const iconMap: Record<string, any> = {
  FileText: FileText,
  Users: Users,
  TrendingUp: TrendingUp,
  Eye: Eye
};

export function AdminDashboard({ onBack, onNavigate, }: AdminDashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]); // Тепер це стан
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Одночасний запит до всіх необхідних ендпоінтів
        const [statsRes, postsRes, popularRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/posts'),
          api.get('/admin/popular') // Новий ендпоінт для популярних постів[cite: 12]
        ]);
        
        setStats(statsRes.data);
        setRecentPosts(postsRes.data);
        setPopularPosts(popularRes.data);
      } catch (err) {
        console.error("Помилка завантаження даних адмін-панелі:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
      <div className="flex flex-1">
        {/* Sidebar[cite: 5] */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">B</div>
              <span className="font-semibold text-lg">Admin Panel</span>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="h-4 w-4" /> Overview
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="h-4 w-4" /> Posts
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <Users className="h-4 w-4" /> Users
            </button>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6 lg:hidden">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your blog platform content</p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">Завантаження даних...</div>
            ) : (
              <>
                {/* Stats Grid[cite: 5] */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon] || FileText;
                    return (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`h-12 w-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">{stat.trend}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Posts Table[cite: 5] */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100"><h2 className="text-xl font-bold">Recent Posts</h2></div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Post</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Views</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {recentPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">{post.title}</p>
                                <p className="text-xs text-gray-500">{post.author} • {post.date}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                  post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {post.status === "published" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                  {post.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">{post.views.toLocaleString()}</td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="p-1.5 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded"><Edit className="h-4 w-4" /></button>
                                  <button className="p-1.5 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Dynamic Popular Posts[cite: 12] */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Popular Posts</h3>
                    <div className="space-y-4">
                      {popularPosts.map((post, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">{index + 1}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{post.author}</span>
                              <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.views}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
  );
}