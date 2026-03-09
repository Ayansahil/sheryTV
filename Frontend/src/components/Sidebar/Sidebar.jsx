import React from "react";

const Sidebar = ({ children }) => {
  return (
    <aside className="hidden md:flex flex-col min-h-screen w-20 lg:w-64 bg-[#231B2E]/60 backdrop-blur-xl border-r border-white/10 transition-all duration-300">
      {children}
    </aside>
  );
};

export default Sidebar;
