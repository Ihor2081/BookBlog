import { Search } from "lucide-react";
import type { Page } from "../types/navigation";

interface HeaderProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  userRole: "admin" | "user" | null;
  onLogout: () => void;
}

export function Header({
  onNavigate,
  isLoggedIn,
  userRole,
  onLogout,
}: HeaderProps) {
  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT SIDE - LOGO */}
        <div className="flex items-center w-1/4">
          <h1
            onClick={() => onNavigate("home")}
            className="text-2xl font-bold cursor-pointer text-gray-900 hover:text-blue-600 transition-colors"
          >
            BookBlog
          </h1>
        </div>

        {/* CENTER - NAVIGATION */}
        <nav className="flex items-center justify-center gap-8 w-1/2">
          <button
            onClick={() => onNavigate("home")}
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            Home
          </button>

          <button
            onClick={() => onNavigate("about")}
            className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
          >
            About
          </button>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-end gap-4 w-1/4">

          {/* SEARCH */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-500 mr-2" />

            <input
              type="text"
              placeholder="Search posts..."
              className="bg-transparent outline-none text-sm w-40"
            />
          </div>

          {/* GUEST */}
          {!isLoggedIn && (
            <>
              <button
                onClick={() => onNavigate("login")}
                className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
              >
                Login
              </button>

              <button
                onClick={() => onNavigate("register")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Registration
              </button>
            </>
          )}

          {/* DASHBOARD */}
          {isLoggedIn && (
            <div className="flex items-center gap-3 whitespace-nowrap">
    
             {userRole === "user" && (
               <button
                onClick={() => onNavigate("user-dashboard")}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
               >
                User Dashboard
               </button>
             )}

             {userRole === "admin" && (
               <button
                 onClick={() => onNavigate("admin-dashboard")}
                 className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
               >
                 Admin Panel
               </button>
             )}
            </div>
          )}

          {/* LOGOUT */}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="text-gray-700 font-medium hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}