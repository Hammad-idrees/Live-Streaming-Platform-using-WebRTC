import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaBell } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Remove useNotifications import and usage. Prepare for Pusher-based notification logic.

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-dark-900 border-b border-dark-700">
      {/* ...other header content... */}
      <div className="relative ml-auto">
        <button
          className="relative focus:outline-none"
          onClick={() => setShowDropdown((v) => !v)}
        >
          <FaBell className="text-xl text-white" />
          {notifications.some((n) => !n.read) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {notifications.filter((n) => !n.read).length}
            </span>
          )}
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-lg z-50">
            <div className="p-3 border-b border-dark-700 font-semibold text-white">
              Notifications
            </div>
            <ul className="max-h-80 overflow-y-auto divide-y divide-dark-700">
              {notifications.length === 0 ? (
                <li className="p-4 text-gray-400 text-center">
                  No notifications yet.
                </li>
              ) : (
                notifications.map((notif, idx) => (
                  <li
                    key={idx}
                    className="p-3 hover:bg-dark-700 transition-colors"
                  >
                    <div className="font-medium text-blue-400 text-xs mb-1">
                      {notif.type}
                    </div>
                    <div className="text-white text-sm">{notif.message}</div>
                    {notif.data && notif.data.vodId && (
                      <a
                        href={`/vod/${notif.data.vodId}`}
                        className="text-blue-500 text-xs hover:underline mt-1 block"
                      >
                        View Video
                      </a>
                    )}
                    {notif.data && notif.data.streamId && (
                      <a
                        href={`/stream/${notif.data.streamId}`}
                        className="text-blue-500 text-xs hover:underline mt-1 block"
                      >
                        View Stream
                      </a>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
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
      </div>
    </header>
  );
};

export default Header;
