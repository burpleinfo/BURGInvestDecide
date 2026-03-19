import React from "react";

// Make sure to install react-icons if not already installed:
// npm install react-icons
import { User, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/95 border-b border-yellow-400 shadow-[0_4px_24px_0_rgba(0,0,0,0.18)] z-50 backdrop-blur-sm">
      {/* Logo/Brand */}
      <div className="flex items-center text-2xl font-bold select-none">
        <span className="text-black">BURG</span>
        <span className="text-yellow-500 ml-1">Investdecide</span>
      </div>
      {/* Right icons */}
      <div className="flex items-center gap-4">
        <User className="w-8 h-8 text-gray-700 cursor-pointer" />
        <Menu className="w-8 h-8 text-gray-700 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;