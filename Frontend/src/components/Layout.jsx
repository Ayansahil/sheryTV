import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import SidebarLogo from './Sidebar/SidebarLogo';
import SidebarMenu from './Sidebar/SidebarMenu';
import SidebarFooter from './Sidebar/SidebarFooter';
import MobileSidebar from './MobileSidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#1A1625]">
      {/* Desktop/Tablet Sidebar */}
      <Sidebar>
        <SidebarLogo />
        <SidebarMenu />
        <SidebarFooter />
      </Sidebar>

      {/* Mobile Sidebar (Overlay) */}
      <MobileSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;