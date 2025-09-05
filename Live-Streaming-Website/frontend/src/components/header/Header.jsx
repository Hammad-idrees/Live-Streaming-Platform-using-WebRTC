import React from "react";
import { Menu } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HeaderNotifications from "./HeaderNotifications";
import HeaderProfileMenu from "./HeaderProfileMenu";
import HeaderUpgradeModal from "./HeaderUpgradeModal";
import HeaderStreamerAction from "./HeaderStreamerAction";
import HeaderSearch from "./HeaderSearch";
import { useHeader } from "./useHeader";

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const {
    user,
    showProfileMenu,
    setShowProfileMenu,
    notifications,
    setNotifications,
    showNotifications,
    setShowNotifications,
    navigate,
    showUpgradeModal,
    setShowUpgradeModal,
    upgradeLoading,

    upgradeError,

    handleLogout,
    handleProfileClick,
    handleSettingsClick,
    getAvatarSrc,
    handleUpgradeToStreamer,
  } = useHeader();

  // Remove any useNotifications or Socket.IO notification logic. Prepare for Pusher-based notification logic.

  return (
    <header className="bg-dark-900 border-b border-dark-800 p-4 relative z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="text-dark-400 hover:text-white transition-colors p-1"
          >
            <Menu size={20} />
          </button>
          <HeaderSearch />
        </div>
        <div className="flex items-center gap-4">
          <HeaderStreamerAction
            user={user}
            onGoLive={() => navigate("/studio")}
            onUpgradeClick={() => setShowUpgradeModal(true)}
          />
          <HeaderNotifications
            notifications={notifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            setNotifications={setNotifications}
          />
          <HeaderProfileMenu
            user={user}
            showProfileMenu={showProfileMenu}
            setShowProfileMenu={setShowProfileMenu}
            getAvatarSrc={getAvatarSrc}
            handleProfileClick={handleProfileClick}
            handleSettingsClick={handleSettingsClick}
            handleLogout={handleLogout}
          />
        </div>
      </div>
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        ></div>
      )}
      {showUpgradeModal && (
        <HeaderUpgradeModal
          show={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgradeToStreamer}
          loading={upgradeLoading}
          error={upgradeError}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </header>
  );
};

export default Header;
