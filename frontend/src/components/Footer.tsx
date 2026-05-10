import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="font-bold text-white">B</span>
              </div>
              <span className="font-semibold text-lg">BookBlog</span>
            </div>
            <p className="text-gray-500 text-sm max-w-sm">
              A modern platform for book lovers to share their thoughts, reviews, and insights.
              Join our community of passionate readers and writers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Fiction
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Non-Fiction
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Science
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">About</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © 2026 BookBlog. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
