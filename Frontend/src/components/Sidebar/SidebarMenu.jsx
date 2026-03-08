import React from 'react'

const SidebarMenu = () => {
  return (
    <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
      {/* Main Menu Items */}
      <div className="space-y-1 mb-4">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-purple-400 bg-purple-500/10 rounded-lg hover:bg-purple-500/20 transition group">
          <i className="ri-home-4-fill text-lg"></i>
          <span className="text-sm font-medium truncate">Home</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-compass-3-line text-lg"></i>
          <span className="text-sm font-medium truncate">Explore</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-stack-line text-lg"></i>
          <span className="text-sm font-medium truncate">Genres</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-bookmark-line text-lg"></i>
          <span className="text-sm font-medium truncate">Favourites</span>
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 my-2"></div>

      {/* Secondary Menu Items */}
      <div className="space-y-1 mb-4">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-play-circle-line text-lg"></i>
          <span className="text-sm font-medium truncate">Continue Watching</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-time-line text-lg"></i>
          <span className="text-sm font-medium truncate">Recently Added</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-folder-3-line text-lg"></i>
          <span className="text-sm font-medium truncate">My Collections</span>
        </a>

        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-download-2-line text-lg"></i>
          <span className="text-sm font-medium truncate">Downloads</span>
        </a>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 my-2"></div>

      {/* Settings */}
      <div className="space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition group">
          <i className="ri-settings-3-line text-lg"></i>
          <span className="text-sm font-medium truncate">Settings</span>
        </a>
      </div>
    </nav>
  );
};

export default SidebarMenu;


