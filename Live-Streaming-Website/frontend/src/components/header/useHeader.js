import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiConfig } from "../../utils/api/config";
import { upgradeToStreamer } from "../../utils/api/profile";
import { useNotifications } from "../../hooks/useNotifications";
import { toast } from "react-toastify";

export function useHeader() {
  const { user, logout, updateUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (!user?._id) return;

    const storageKey = `notifications_${user._id}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsedNotifications = JSON.parse(saved);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        localStorage.removeItem(storageKey);
      }
    }
    setIsLoadingNotifications(false);
  }, [user._id]); // Empty dependency array to run only on mount

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (isLoadingNotifications || !user?._id) return;

    const storageKey = `notifications_${user._id}`;
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications, user?._id, isLoadingNotifications]);

  // Real-time notifications via Pusher
  const handleNotification = useCallback(
    (notif) => {
      setNotifications((prev) => {
        const updated = [notif, ...prev].slice(0, 20);
        return updated;
      });
      toast.info(notif.message);
    },
    [setNotifications]
  );

  useNotifications(handleNotification);

  // Clear notifications on logout
  const handleLogout = () => {
    if (user?._id) {
      localStorage.removeItem(`notifications_${user._id}`);
    }
    setNotifications([]);
    logout();
    setShowProfileMenu(false);
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    setShowProfileMenu(false);
  };

  const getAvatarSrc = () => {
    if (!user?.avatar) return "/images/profile/avatar.svg";

    if (user.avatar.startsWith("/uploads")) {
      const bust = user.updatedAt
        ? `?t=${new Date(user.updatedAt).getTime()}`
        : `?t=${Date.now()}`;
      return `${apiConfig.baseURL}${user.avatar}${bust}`;
    }
    return user.avatar;
  };

  const handleUpgradeToStreamer = async () => {
    setUpgradeLoading(true);
    setUpgradeError("");

    try {
      const result = await upgradeToStreamer();
      if (result.success) {
        updateUser(result.user);
        setShowUpgradeModal(false);
        navigate("/studio");
      } else {
        setUpgradeError(result.error || "Failed to upgrade");
      }
    } catch (error) {
      setUpgradeError("Network error occurred");
    } finally {
      setUpgradeLoading(false);
    }
  };

  return {
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
    setUpgradeLoading,
    upgradeError,
    setUpgradeError,
    handleLogout,
    handleProfileClick,
    handleSettingsClick,
    getAvatarSrc,
    handleUpgradeToStreamer,
  };
}
