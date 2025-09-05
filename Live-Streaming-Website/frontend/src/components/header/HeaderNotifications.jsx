import React from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeaderNotifications = ({
  notifications,
  showNotifications,
  setShowNotifications,
  setNotifications,
}) => {
  const navigate = useNavigate();
  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const now = new Date();
    const date = new Date(timestamp);
    const diffMinutes = Math.floor((now - date) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="text-dark-400 hover:text-white transition-colors relative p-2"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-live rounded-full animate-pulse"></div>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-dark-800 border border-dark-700 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-dark-700 flex justify-between items-center">
            <h3 className="text-white font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  setNotifications([]);
                }}
                className="text-xs text-primary-400 hover:text-primary-300"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-gray-400 text-center">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={
                    notification.id ||
                    `notif-${index}-${notification.timestamp}`
                  }
                  className="p-4 hover:bg-dark-700 transition-colors border-b border-dark-700/50 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {notification.avatar ? (
                      <img
                        src={notification.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <Bell size={14} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {notification.message || "New notification"}
                      </p>
                      {/* Show comment body if present */}
                      {notification.type === "comment" &&
                        notification.data?.comment && (
                          <p className="text-blue-300 text-xs mt-1 italic">
                            "{notification.data.comment}"
                          </p>
                        )}
                      <p className="text-dark-400 text-xs mt-1">
                        {formatTime(
                          notification.timestamp || notification.time
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-dark-700">
            <button
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              onClick={() => {
                setShowNotifications(false);
                navigate("/notifications");
              }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNotifications;
