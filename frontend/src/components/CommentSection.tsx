import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Heart, MoreVertical } from "lucide-react";

import api from "../lib/api";

interface Comment {
  id: number;
  content: string;

  created_at?: string;

  likes_count?: number;

  user?: {
    id: number;
    username: string;
    avatar?: string | null;
  };

  guest_name?: string | null;
}

interface CommentSectionProps {
  postId: number;
}

export function CommentSection({
  postId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [commentText, setCommentText] = useState("");

  const [guestName, setGuestName] = useState("");

  const [guestEmail, setGuestEmail] = useState("");

  const [showGuestForm, setShowGuestForm] = useState(false);

  const token = Cookies.get("access_token");

  const isLoggedIn = Boolean(token);

  // =========================================
  // FETCH COMMENTS
  // =========================================
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(
          `/comments/post/${postId}`
        );

        setComments(response.data);
      } catch (error) {
        console.error(
          "Comments loading error:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // =========================================
  // FORMAT DATE
  // =========================================
  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return "Recently";
    }

    return new Date(dateString).toLocaleString();
  };

  // =========================================
  // SUBMIT COMMENT
  // =========================================
  const handleSubmitComment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    try {
      // =====================================
      // AUTHORIZED USER COMMENT
      // =====================================
      if (isLoggedIn) {
        const response = await api.post(
          `/comments/post/${postId}`,
          {
            content: commentText,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments((prev) => [
          response.data,
          ...prev,
        ]);
      }

      // =====================================
      // GUEST COMMENT
      // =====================================
      else {
        if (
          !guestName.trim() ||
          !guestEmail.trim()
        ) {
          alert(
            "Please enter your name and email"
          );

          return;
        }

        const response = await api.post(
          `/comments/post/${postId}/guest`,
          {
            content: commentText,
            guest_name: guestName,
            guest_email: guestEmail,
          }
        );

        setComments((prev) => [
          response.data,
          ...prev,
        ]);
      }

      // =====================================
      // RESET FORM
      // =====================================
      setCommentText("");

      setGuestName("");

      setGuestEmail("");

      setShowGuestForm(false);
    } catch (error: any) {
      console.error(
        "Comment creation error:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to add comment"
      );
    }
  };

  // =========================================
  // LIKE COMMENT
  // =========================================
  const handleLikeComment = async (
    commentId: number
  ) => {
    try {
      await api.post(
        `/comments/${commentId}/like`,
        {},
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined
      );

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likes_count:
                  (comment.likes_count || 0) + 1,
              }
            : comment
        )
      );
    } catch (error) {
      console.error(
        "Like comment error:",
        error
      );
    }
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* ===================================== */}
      {/* COMMENT FORM */}
      {/* ===================================== */}

      <div className="mb-10">
        {isLoggedIn ? (
          <form
            onSubmit={handleSubmitComment}
            className="space-y-4"
          >
            <textarea
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write your comment..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6">
            {!showGuestForm ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Join the discussion
                </p>

                <button
                  onClick={() =>
                    setShowGuestForm(true)
                  }
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Comment as Guest
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmitComment}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={guestName}
                    onChange={(e) =>
                      setGuestName(e.target.value)
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                  <input
                    type="email"
                    placeholder="Your email"
                    value={guestEmail}
                    onChange={(e) =>
                      setGuestEmail(
                        e.target.value
                      )
                    }
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) =>
                    setCommentText(e.target.value)
                  }
                  placeholder="Write your comment..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowGuestForm(false)
                    }
                    className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ===================================== */}
      {/* COMMENTS LIST */}
      {/* ===================================== */}

      {isLoading ? (
        <div className="text-gray-500">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500">
          No comments yet.
        </div>
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => {
            const authorName =
              comment.user?.username ||
              comment.guest_name ||
              "Anonymous";

            const avatar =
              comment.user?.avatar;

            return (
              <div
                key={comment.id}
                className="flex gap-4"
              >
                {/* AVATAR */}

                {avatar ? (
                  <img
                    src={avatar}
                    alt={authorName}
                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-700">
                      {authorName
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}

                {/* CONTENT */}

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {authorName}
                        </span>

                        {!comment.user && (
                          <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                            Guest
                          </span>
                        )}
                      </div>

                      <span className="text-sm text-gray-500">
                        {formatDate(
                          comment.created_at
                        )}
                      </span>
                    </div>

                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleLikeComment(
                          comment.id
                        )
                      }
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />

                      {(comment.likes_count ||
                        0) > 0 && (
                        <span>
                          {
                            comment.likes_count
                          }
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}