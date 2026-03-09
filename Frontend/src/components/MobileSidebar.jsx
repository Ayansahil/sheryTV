import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMobileSidebarOpen } from '../store/uiSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

// This component combines the logic of SidebarLogo, SidebarMenu, and SidebarFooter
// but is specifically for the mobile overlay.

const MobileSidebar = () => {
    const { isMobileSidebarOpen } = useSelector((state) => state.ui);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClose = () => {
        dispatch(setMobileSidebarOpen(false));
    };

    const handleNavigate = (to) => {
        navigate(to);
        handleClose();
    };
    
    const handleLogout = () => {
        dispatch(logout());
        handleClose();
    }

    const isActive = (path) => location.pathname === path;

    const menuItem = (to, icon, label) => (
        <button 
          onClick={() => handleNavigate(to)} 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition group w-full ${
            isActive(to) 
              ? 'text-purple-400 bg-purple-500/10 hover:bg-purple-500/20' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <i className={`${icon} text-lg`}></i>
          <span className="text-sm font-medium truncate">{label}</span>
        </button>
    );

    if (!isMobileSidebarOpen) return null;

    return (
        <div className="md:hidden fixed inset-0 z-[60]">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Sidebar Content */}
            <aside className="relative flex flex-col h-full w-64 bg-[#231B2E] border-r border-white/10">
                {/* Logo */}
                <div className="w-full px-4 py-5 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0">
                        <i className="ri-tv-line text-purple-400 text-2xl shrink-0"></i>
                        <span className="text-white font-lexend font-semibold text-2xl truncate">
                            Shery Tv
                        </span>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 flex flex-col px-3 py-4 overflow-y-auto">
                    <div className="space-y-1 mb-4">
                        {menuItem('/', 'ri-home-4-fill', 'Home')}
                        {menuItem('/explore', 'ri-compass-3-line', 'Explore')}
                        {menuItem('/genres', 'ri-stack-line', 'Genres')}
                        {menuItem('/people', 'ri-user-star-line', 'People')}
                        {menuItem('/favourites', 'ri-bookmark-line', 'Favourites')}
                    </div>
                    <div className="h-px bg-white/5 my-2"></div>
                    <div className="space-y-1">
                        {menuItem('/settings', 'ri-settings-3-line', 'Settings')}
                    </div>
                </nav>

                {/* Footer */}
                <div className="mt-auto px-3 py-4 border-t border-white/5">
                    {isAuthenticated && user?.role === 'admin' && (
                        <button
                            onClick={() => handleNavigate('/admin')}
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition w-full cursor-pointer mb-2"
                        >
                            <i className="ri-shield-user-line text-lg"></i>
                            <span className="text-sm font-medium truncate">Admin Panel</span>
                        </button>
                    )}
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition w-full cursor-pointer"
                        >
                            <i className="ri-logout-box-line text-lg"></i>
                            <span className="text-sm font-medium truncate">Logout</span>
                        </button>
                    ) : (
                        <button onClick={() => handleNavigate('/login')}
                            className="flex items-center gap-3 text-gray-400 hover:text-white transition px-4 py-2 w-full cursor-pointer">
                            <i className="ri-login-box-line" />
                            <span>Login / Signup</span>
                        </button>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default MobileSidebar;