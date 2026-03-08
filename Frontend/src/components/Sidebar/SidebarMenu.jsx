import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SidebarMenu = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const menuItem = (to, icon, label) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition group ${
        isActive(to) 
          ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' 
          : 'text-gray-400 hover:text-white'
      }`}
    >
      <i className={`${icon} text-lg`}></i>
      <span className="text-sm font-medium truncate">{label}</span>
    </Link>
  );

  return (
    <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
      <div className="space-y-1 mb-4">
        {menuItem('/', 'ri-home-4-fill', 'Home')}
        {menuItem('/explore', 'ri-compass-3-line', 'Explore')}
        {menuItem('/genres', 'ri-stack-line', 'Genres')}
        {menuItem('/people', 'ri-user-star-line', 'People')}
        {menuItem('/favourites', 'ri-bookmark-line', 'Favourites')}
      </div>

      <div className="h-px bg-white/5 my-2"></div>

      <div className="space-y-1 mb-4">
        {menuItem('/continue-watching', 'ri-play-circle-line', 'Continue Watching')}
        {menuItem('/recently-added', 'ri-time-line', 'Recently Added')}
        {menuItem('/collections', 'ri-folder-3-line', 'My Collections')}
        {menuItem('/downloads', 'ri-download-2-line', 'Downloads')}
      </div>

      <div className="h-px bg-white/5 my-2"></div>

      <div className="space-y-1">
        {menuItem('/settings', 'ri-settings-3-line', 'Settings')}
      </div>
    </nav>
  );
};

export default SidebarMenu;