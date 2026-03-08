import React from "react";

const SidebarFooter = () => {
  return (
    <div className="px-3 py-4 border-t border-white/5">
      <button className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition w-full">
        <i className="ri-logout-box-line text-lg"></i>
        <span className="text-sm font-medium truncate">Logout</span>
      </button>
    </div>
  );
};

export default SidebarFooter;