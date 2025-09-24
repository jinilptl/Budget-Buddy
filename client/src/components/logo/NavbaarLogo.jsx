import React from 'react';



// Navbar Logo Component with sleek design
const NavbarLogo = ({ collapsed = false }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100">
      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center relative shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
        <span className="text-xl font-extrabold text-white group-hover:rotate-12 transition-transform duration-300">B</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
      </div>
      
      {!collapsed && (
        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-300">
          Budget Buddy
        </div>
      )}
    </div>
  );
};

export default NavbarLogo;

