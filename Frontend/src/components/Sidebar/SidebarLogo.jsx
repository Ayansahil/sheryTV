import React from 'react'

const SidebarLogo = () => {
  return (
    <div className="w-full px-4 py-5 flex items-center lg:justify-between justify-center overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <i className="ri-tv-line text-purple-400 text-2xl shrink-0"></i>
        <span className="text-white font-lexend font-semibold text-2xl truncate hidden lg:inline">
          Shery Tv
        </span>
      </div>

      {/* Collapse Icon */}
      <button className="text-gray-400 hover:text-white transition shrink-0 p-1 rounded hover:bg-white/5 cursor-pointer hidden lg:inline">
        <i className="ri-sidebar-fold-line text-xl"></i>
      </button>
    </div>
  );
};

export default SidebarLogo