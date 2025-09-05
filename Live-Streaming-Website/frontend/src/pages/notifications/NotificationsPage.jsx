import React from "react";
import { useHeader } from "../../components/header/useHeader";
import { Bell } from "lucide-react";

const NotificationsPage = () => {
  const { notifications, setNotifications } = useHeader();

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bell size={24} /> Notifications
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className="text-xs text-primary-400 hover:text-primary-300"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="bg-dark-800 rounded-xl shadow-lg divide-y divide-dark-700">
        {notifications.length === 0 ? (
          <div className="p-8 text-gray-400 text-center">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={
                notification.id || `notif-${index}-${notification.timestamp}`
              }
              className="p-5 hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                {notification.avatar ? (
                  <img
                    src={notification.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <Bell size={16} className="text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white text-base">
                    {notification.message || "New notification"}
                  </p>
                  {notification.type === "comment" &&
                    notification.data?.comment && (
                      <p className="text-blue-300 text-sm mt-1 italic">
                        "{notification.data.comment}"
                      </p>
                    )}
                  <p className="text-dark-400 text-xs mt-1">
                    {formatTime(notification.timestamp || notification.time)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
