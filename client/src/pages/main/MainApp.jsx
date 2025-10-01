import React from "react";
import { Home, History, Plus, BarChart3, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import MainLogo from "../../components/logo/MainLogo";
import Avatar from "../../components/Avatar";

export function MainApp() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Top Header */}
      <header className="bg-white fixed top-0 left-0 right-0 z-50 shadow-sm border-b px-4 lg:px-6 py-4 flex items-center justify-around">
        <MainLogo size="small" ballSize="small" />
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Avatar />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 mt-16">
        <div className="max-w-4xl mx-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 lg:px-6 py-2 lg:py-3 safe-area-padding-bottom shadow-lg lg:shadow-xl">
        <div className="flex justify-around lg:justify-center lg:space-x-8 items-center max-w-md lg:max-w-4xl mx-auto">
          
          {/* Home */}
          <NavLink
            to="/home/main"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 lg:px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Home className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm font-medium">Home</span>
          </NavLink>

          {/* History */}
          <NavLink
            to="/home/history"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 lg:px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <History className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm font-medium">History</span>
          </NavLink>

          {/* Add */}
          <NavLink
            to="/home/add-transaction"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-transform"
          >
            <Plus className="w-6 h-6" />
          </NavLink>

          {/* Analytics */}
          <NavLink
            to="/home/analytics"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 lg:px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm font-medium">Analytics</span>
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/home/profile"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 py-2 px-3 lg:px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-600 bg-green-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <User className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="text-xs lg:text-sm font-medium">Profile</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
