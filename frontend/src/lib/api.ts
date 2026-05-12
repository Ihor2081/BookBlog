import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// =========================
// TYPES
// =========================
export interface CreatePostData {
  title: string;
  content: string;
  category_id: number;
  tags: string[];
  cover_image?: string;
  status?: "draft" | "published";
}

export interface UpdatePostStatusData {
  status: "draft" | "published";
}


// =========================
// ADMIN API
// =========================
export const adminApi = {
  // GET /api/admin/posts
  getPosts: async () => {
    const response = await api.get("/admin/posts");
    return response.data;
  },

  // POST /api/admin/posts
  createPost: async (data: CreatePostData) => {
    const response = await api.post("/admin/posts", data);
    return response.data;
  },

  // PATCH /api/admin/posts/{id}/status
  updatePostStatus: async (
    id: number,
    data: UpdatePostStatusData
  ) => {
    const response = await api.patch(
      `/admin/posts/${id}/status`,
      data
    );

    return response.data;
  },

  // DELETE /api/admin/posts/{id}
  deletePost: async (id: number) => {
    const response = await api.delete(
      `/admin/posts/${id}`
    );

    return response.data;
  },

  // GET /api/admin/stats
  getStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // POST /api/admin/categories
  createCategory: async (name: string) => {
    const response = await api.post(
      "/admin/categories",
      { name }
    );

    return response.data;
  },
};


// =========================
// POSTS API
// =========================
export const postsApi = {
  // GET /api/posts
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    category_id?: number;
    sort_by?: string;
  }) => {
    const response = await api.get("/posts", {
      params,
    });

    return response.data;
  },

  // GET /api/posts/{slug}
  getBySlug: async (slug: string) => {
    const response = await api.get(`/posts/${slug}`);
    return response.data;
  },

  // POST /api/posts
  create: async (data: CreatePostData) => {
    const response = await api.post("/posts", data);
    return response.data;
  },

  // PUT /api/posts/{id}
  update: async (
    id: number,
    data: Partial<CreatePostData>
  ) => {
    const response = await api.put(
      `/posts/${id}`,
      data
    );

    return response.data;
  },

  // DELETE /api/posts/{id}
  delete: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};


// =========================
// OPTIONAL JWT HELPER
// =========================
export function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default api;