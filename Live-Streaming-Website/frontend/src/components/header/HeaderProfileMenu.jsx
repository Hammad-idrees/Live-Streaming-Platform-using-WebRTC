import React from "react";
import { ChevronDown, Settings, LogOut, User } from "lucide-react";

const HeaderProfileMenu = ({
  user,
  showProfileMenu,
  setShowProfileMenu,
  getAvatarSrc,
  handleProfileClick,
  handleSettingsClick,
  handleLogout,
}) => (
  <div className="relative">
    <button
      onClick={() => setShowProfileMenu(!showProfileMenu)}
      className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 px-3 py-2 rounded-lg transition-all"
    >
      <img
        src={getAvatarSrc()}
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
      />
      <span className="text-white font-medium text-sm">{user?.username}</span>
      <ChevronDown size={16} className="text-dark-400" />
    </button>
    {showProfileMenu && (
      <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden z-50">
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-dark-700 transition-colors"
        >
          <User size={16} />
          Profile
        </button>
        <button
          onClick={handleSettingsClick}
          className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-dark-700 transition-colors"
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-dark-700 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    )}
  </div>
);

export default HeaderProfileMenu;
