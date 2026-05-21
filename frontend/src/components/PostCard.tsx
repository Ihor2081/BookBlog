import {
  Heart,
  Eye,
  Clock,
} from "lucide-react";

interface PostCardProps {
  variant?: "featured" | "standard" | "compact";

  title: string;

  excerpt: string;

  author: {
    name: string;
    avatar: string;
  };

  date: string;

  readTime: string;

  views: number;

  likes: number;

  category: string;

  categoryColor: string;

  coverImage: string;

  tags?: string[];
}

export function PostCard({
  variant = "standard",
  title,
  excerpt,
  author,
  date,
  readTime,
  views,
  likes,
  category,
  categoryColor,
  coverImage,
  tags = [],
}: PostCardProps) {
  const safeExcerpt =
    excerpt.length > 140
      ? excerpt.slice(0, 140) + "..."
      : excerpt;

  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-card shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <span
              className={`inline-flex w-fit px-3 py-1 text-xs font-medium rounded-full mb-4 ${categoryColor}`}
            >
              {category}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-6 line-clamp-3">
              {safeExcerpt}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {author.name}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{date}</span>

                    <span>•</span>

                    <Clock className="h-3 w-3" />

                    <span>{readTime}</span>
                  </div>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />

                  {views}
                </span>

                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />

                  {likes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full mb-3 ${categoryColor}`}
        >
          {category}
        </span>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {safeExcerpt}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-8 w-8 rounded-full object-cover"
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {author.name}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{date}</span>

              <span>•</span>

              <span>{readTime}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />

              {views}
            </span>

            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />

              {likes}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags
                .slice(0, 2)
                .map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}