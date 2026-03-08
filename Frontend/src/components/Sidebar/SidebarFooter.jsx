import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

const SidebarFooter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="px-3 py-4 border-t border-white/5">
      {isAuthenticated ? (
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition w-full"
        >
          <i className="ri-logout-box-line text-lg"></i>
          <span className="text-sm font-medium truncate">Logout</span>
        </button>
      ) : (
        <button onClick={() => navigate('/login')}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition px-4 py-2 w-full">
            <i className="ri-login-box-line" />
            <span>Login / Signup</span>
        </button>
      )}
    </div>
  );
};

export default SidebarFooter;