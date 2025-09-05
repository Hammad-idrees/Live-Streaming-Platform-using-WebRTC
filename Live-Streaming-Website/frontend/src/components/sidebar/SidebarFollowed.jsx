import React from "react";

const SidebarFollowed = ({ followedStreamers, isOpen }) => (
  <div>
    <h3 className="text-dark-400 text-sm font-medium mb-3 px-3">Following</h3>
    <div className="space-y-1">
      {followedStreamers.map((streamer, index) => (
        <button
          key={index}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all"
        >
          <div className="relative flex-shrink-0">
            <img
              src={streamer.avatar}
              alt={streamer.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(streamer.name) +
                  "&background=0D8ABC&color=fff&size=32";
              }}
            />
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-900 ${
                streamer.isLive ? "bg-live" : "bg-dark-600"
              }`}
            ></div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate">{streamer.name}</div>
            {streamer.isLive ? (
              <div className="text-xs text-dark-400 truncate">
                {streamer.category} • {streamer.viewers}
              </div>
            ) : (
              <div className="text-xs text-dark-500">{streamer.lastSeen}</div>
            )}
          </div>
          {streamer.isLive && (
            <div className="w-2 h-2 bg-live rounded-full flex-shrink-0 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default SidebarFollowed;
