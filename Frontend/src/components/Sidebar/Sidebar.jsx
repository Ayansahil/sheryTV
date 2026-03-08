import React from "react";

const Sidebar = ({ children }) => {
  return (
    <aside className="flex flex-col min-h-screen w-[15%] bg-[#231B2E]/60 backdrop-blur-xl border-r border-white/10">
      {children}
    </aside>
  );
};

export default Sidebar;
