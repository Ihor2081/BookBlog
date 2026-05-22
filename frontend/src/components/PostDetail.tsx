import {
  Heart,
  Eye,
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import { useEffect, useState } from "react";

import api from "../lib/api";

import { CommentSection } from "./CommentSection";

import type { Page } from "../types/navigation";

interface PostDetailProps {
  postId: number | null;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

interface Author {
  id: number;
  username: string;
}

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user?: {
    id: number;
    username: string;
  };
}

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  status: string;
  views: number;
  likes_count: number;
  read_time: string;
  created_at: string;
  updated_at: string;

  author?: Author;
  category?: Category | null;
  tags?: Tag[];

  comments?: Comment[];
}

export function PostDetail({
  postId,
  onBack,
}: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [liked, setLiked] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);

  const [likes, setLikes] = useState(0);

  // =========================================
  // FETCH POST
  // =========================================
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(`/posts/${postId}`);

        const postData = response.data;

        setPost(postData);

        setLikes(postData.likes_count || 0);
      } catch (error) {
        console.error("Post loading error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // =========================================
  // LIKE
  // =========================================
  const handleLike = async () => {
    if (!post) return;

    try {
      if (!liked) {
        setLikes((prev) => prev + 1);
      } else {
        setLikes((prev) => Math.max(prev - 1, 0));
      }

      setLiked(!liked);

      // optional backend endpoint
      // await api.post(`/posts/${post.id}/like`);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // =========================================
  // SHARE
  // =========================================
  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.title,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);

      alert("Link copied");
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>

            <div className="h-96 bg-gray-200 rounded-2xl"></div>

            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================
  if (!post) {
    return (
      <main className="container mx-auto px-6 py-12 flex-1">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Post not found
          </h1>

          <button
            onClick={onBack}
            className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Back to posts
          </button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(
    post.created_at
  ).toLocaleDateString();

  return (
    <main className="container mx-auto px-6 py-8 flex-1">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />

        Back to posts
      </button>

      <article className="max-w-4xl mx-auto">
        {/* CATEGORY */}
        {post.category && (
          <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700 mb-6">
            {post.category.name}
          </span>
        )}

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {post.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 mb-8">
          {/* AUTHOR */}
          <div className="flex items-center gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author?.username || "User"
              )}&background=random`}
              alt={post.author?.username || "Author"}
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold text-gray-900">
                {post.author?.username || "Unknown author"}
              </p>

              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>{formattedDate}</span>

                <span>•</span>

                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />

                  {post.read_time || "1 min read"}
                </span>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="flex items-center gap-6 ml-auto text-gray-500">
            <span className="flex items-center gap-2">
              <Eye className="h-5 w-5" />

              {post.views || 0}
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked
                  ? "text-red-500"
                  : "hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-current" : ""
                }`}
              />

              {likes}
            </button>

            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />

              {post.comments?.length || 0}
            </span>
          </div>
        </div>

        {/* COVER IMAGE */}
        {post.cover_image && (
          <div className="mb-10">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-[500px] object-cover rounded-2xl"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="prose prose-lg max-w-none mb-10">
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />
        </div>

        {/* TAGS */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-8 border-b border-gray-200 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-10">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              liked
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                liked ? "fill-current" : ""
              }`}
            />

            {liked ? "Liked" : "Like this post"}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setBookmarked(!bookmarked)
              }
              className={`p-3 rounded-lg transition-colors ${
                bookmarked
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <Bookmark
                className={`h-5 w-5 ${
                  bookmarked ? "fill-current" : ""
                }`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* AUTHOR CARD */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author?.username || "User"
              )}&background=random`}
              alt={post.author?.username || "Author"}
              className="h-16 w-16 rounded-full object-cover"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                About {post.author?.username}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                Author of this article on BookBlog.
              </p>
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <CommentSection postId={post.id} />
      </article>
    </main>
  );
}