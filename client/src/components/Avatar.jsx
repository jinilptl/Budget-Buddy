import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const colors = [
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-indigo-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-purple-500 to-fuchsia-500",
];

const Avatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
 
console.log("user name ",user?.name);

  let name = user?.name?.trim() || "Guest";
  // pick gradient based on first letter
  const colorIndex = (name.charCodeAt(0) + name.length) % colors.length;
  const gradient = colors[colorIndex];
  const char = name.charAt(0).toUpperCase();
  

   function logoutNavigate() {
    if (confirm("are you sure you want to logout?")) {
      
      
      navigate("/logout");
    }
  }
  

  // close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Avatar Circle */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg transition-all duration-300`}
      >
        <span className="text-white font-bold text-lg md:text-xl select-none">
          {char}
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-md border border-gray-100 py-1 animate-fadeIn z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Link
            to="/home/profile"
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              logoutNavigate() // replace with logout logic
            }}
            className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
