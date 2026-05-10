import { useState } from "react";
import { Heart, MoreVertical } from "lucide-react";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    isRegistered: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  liked: boolean;
}

export function CommentSection() {
  const [isLoggedIn] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?w=200&h=200&fit=crop",
        isRegistered: true
      },
      content: "This is exactly what I needed to read today. I've been struggling with maintaining focus while reading, and these strategies are really practical. Going to try the 15-minute sessions starting tomorrow!",
      timestamp: "2 hours ago",
      likes: 12,
      liked: false
    },
    {
      id: 2,
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=200&h=200&fit=crop",
        isRegistered: true
      },
      content: "Great article! I'd also add that choosing the right book matters. Starting with something engaging rather than difficult helps build the habit.",
      timestamp: "5 hours ago",
      likes: 8,
      liked: false
    },
    {
      id: 3,
      author: {
        name: "Anonymous Reader",
        avatar: "",
        isRegistered: false
      },
      content: "As someone who used to read 50+ books a year and now struggles to finish even one, this really resonates. The part about building stamina gradually is key.",
      timestamp: "1 day ago",
      likes: 15,
      liked: false
    }
  ]);

  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    if (!isLoggedIn && (!guestName.trim() || !guestEmail.trim())) {
      alert("Please fill in your name and email");
      return;
    }

    const newComment: Comment = {
      id: comments.length + 1,
      author: {
        name: isLoggedIn ? "Current User" : guestName,
        avatar: isLoggedIn ? "https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?w=200&h=200&fit=crop" : "",
        isRegistered: isLoggedIn
      },
      content: commentText,
      timestamp: "Just now",
      likes: 0,
      liked: false
    };

    setComments([newComment, ...comments]);
    setCommentText("");
    setGuestName("");
    setGuestEmail("");
    setShowGuestForm(false);
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      <div className="mb-8">
        {isLoggedIn ? (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?w=200&h=200&fit=crop"
                alt="Your avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            {!showGuestForm ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Join the conversation</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Sign In to Comment
                  </button>
                  <button
                    onClick={() => setShowGuestForm(true)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium"
                  >
                    Comment as Guest
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your name"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Your email (won't be published)"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowGuestForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium text-sm">
                  {comment.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {comment.author.name}
                    </span>
                    {!comment.author.isRegistered && (
                      <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                        Guest
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed mb-3">
                {comment.content}
              </p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    comment.liked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${comment.liked ? "fill-current" : ""}`} />
                  {comment.likes > 0 && <span>{comment.likes}</span>}
                </button>
                <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
