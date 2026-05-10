import { Heart, Eye, Clock, Share2, Bookmark, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { CommentSection } from "./CommentSection";
import { Header } from "./Header";
import { Footer } from "./Footer";
import type { Page } from "../types/navigation";
interface PostDetailProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function PostDetail({ onBack, onNavigate, }: PostDetailProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likes, setLikes] = useState(89);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const relatedPosts = [
    {
      title: "The Science of Speed Reading",
      image: "https://images.unsplash.com/photo-1602418514663-a1ee3c1cc626?w=400&h=250&fit=crop",
      readTime: "5 min read"
    },
    {
      title: "Building Better Reading Habits",
      image: "https://images.unsplash.com/photo-1551173953-54a75e46fccd?w=400&h=250&fit=crop",
      readTime: "7 min read"
    },
    {
      title: "Digital vs Physical Books",
      image: "https://images.unsplash.com/photo-1643817632233-cfa0f27713d2?w=400&h=250&fit=crop",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onNavigate={onNavigate} />
      <div className="container mx-auto px-6 py-8 flex-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700 mb-4">
              Reading Tips
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The Art of Deep Reading in the Digital Age
            </h1>

            <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=200&h=200&fit=crop"
                  alt="Sarah Mitchell"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">Sarah Mitchell</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Apr 20, 2026</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      8 min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-auto text-gray-500">
                <span className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  1,247
                </span>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-colors ${
                    liked ? "text-red-500" : "hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                  {likes}
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <img
              src="https://images.unsplash.com/photo-1667039487341-041db260dd87?w=1200&h=600&fit=crop"
              alt="Cover"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              In a world of endless scrolling and bite-sized content, the ability to engage in deep, focused reading has become increasingly rare—and increasingly valuable.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Challenge of Modern Reading</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our brains have adapted to the rapid-fire information consumption of social media and news feeds. We've become experts at skimming, scanning, and quickly moving from one piece of content to the next. While this skill has its place, it comes at a cost: we're losing our capacity for sustained attention and deep comprehension.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Research shows that deep reading—the kind of immersive, focused engagement with text—activates different neural pathways than skimming. It enhances critical thinking, empathy, and analytical skills in ways that quick reading simply cannot match.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Strategies for Deeper Reading</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Create a Distraction-Free Environment</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Turn off notifications, put your phone in another room, and create a physical space dedicated to reading. Your environment shapes your attention span.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Practice Active Reading</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Don't just passively consume words. Take notes, ask questions, and engage critically with the text. Underline passages that resonate with you and write in the margins.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Build Reading Stamina Gradually</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              Start with 15-minute focused reading sessions and gradually increase the duration. Like physical exercise, your attention span will strengthen with consistent practice.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Rewards Are Worth It</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Deep reading isn't just about consuming more books—it's about transforming how you think. It's about developing patience, nuance, and the ability to hold complex ideas in your mind simultaneously. In an age of instant gratification, this is a superpower.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              The digital age doesn't have to be the enemy of deep reading. By being intentional about how we engage with text, we can reclaim the profound benefits of immersive reading while still enjoying the convenience of modern technology.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pb-8 border-b border-gray-200 mb-8">
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">reading</span>
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">productivity</span>
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">mindfulness</span>
            <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">focus</span>
          </div>

          <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like this post"}
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-3 rounded-lg transition-colors ${
                  bookmarked
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
              </button>
              <button className="p-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-12">
            <div className="flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=200&h=200&fit=crop"
                alt="Sarah Mitchell"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">About Sarah Mitchell</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Sarah is a cognitive psychologist and reading researcher with over 15 years of experience studying how we process information. She's passionate about helping people develop better reading habits in the digital age.
                </p>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Follow
                </button>
              </div>
            </div>
          </div>

          <CommentSection />
        </article>

        <div className="max-w-4xl mx-auto mt-16 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post, index) => (
              <article key={index} className="group cursor-pointer">
                <div className="relative h-40 overflow-hidden rounded-lg mb-3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500">{post.readTime}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
