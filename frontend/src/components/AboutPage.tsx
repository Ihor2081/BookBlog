import { ArrowLeft, BookOpen, Users, Target, Heart } from "lucide-react";
import type { Page } from "../types/navigation";

interface AboutPageProps {
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function AboutPage({ onBack, onNavigate, }: AboutPageProps) {
  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & Editor-in-Chief",
      avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?w=400&h=400&fit=crop",
      bio: "Cognitive psychologist passionate about reading and learning"
    },
    {
      name: "Michael Chen",
      role: "Senior Writer",
      avatar: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?w=400&h=400&fit=crop",
      bio: "Literary critic and fiction enthusiast"
    },
    {
      name: "Emily Rodriguez",
      role: "Science Editor",
      avatar: "https://images.unsplash.com/photo-1655249481446-25d575f1c054?w=400&h=400&fit=crop",
      bio: "Neuroscientist exploring the science of reading"
    },
    {
      name: "James Anderson",
      role: "Community Manager",
      avatar: "https://images.unsplash.com/photo-1762522926157-bcc04bf0b10a?w=400&h=400&fit=crop",
      bio: "Building connections among book lovers worldwide"
    }
  ];

  const values = [
    {
      icon: BookOpen,
      title: "Love of Reading",
      description: "We believe in the transformative power of books and the written word. Reading opens minds, builds empathy, and connects us across time and space."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our platform thrives on the diverse perspectives of our readers and writers. Every voice matters, and every story deserves to be heard."
    },
    {
      icon: Target,
      title: "Quality Content",
      description: "We're committed to publishing thoughtful, well-researched content that respects our readers' time and intelligence."
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Great literature and insightful writing should be available to everyone. We strive to make reading accessible and inclusive."
    }
  ];

  const stats = [
    { value: "1,247", label: "Active Readers" },
    { value: "248", label: "Published Posts" },
    { value: "45k", label: "Monthly Views" },
    { value: "15", label: "Categories" }
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

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About BookBlog</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              A modern platform for book lovers to share their thoughts, reviews, and insights.
              Join our community of passionate readers and writers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                BookBlog was founded in 2024 by a group of passionate readers who wanted to create a space
                where thoughtful conversations about books could flourish. In an age of quick takes and hot
                opinions, we believed there was a need for deeper, more considered discussions about literature
                and reading.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                What started as a small blog has grown into a vibrant community of writers, critics, and readers
                from around the world. Our contributors come from diverse backgrounds—from professional literary
                critics to enthusiastic amateur readers—all united by a love of books and a desire to share that
                passion with others.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, BookBlog publishes dozens of articles each month covering everything from classic literature
                to the latest bestsellers, from reading strategies to the science of how books affect our brains.
                We're proud to be a platform that celebrates the written word in all its forms.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <value.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                      <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Whether you're a seasoned literary critic or just someone who loves a good book,
              there's a place for you here. Start sharing your thoughts and connect with fellow readers today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Create an Account
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors font-medium">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
