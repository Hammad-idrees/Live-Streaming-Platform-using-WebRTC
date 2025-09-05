import React from "react";

const LiveStreamersQuickAccess = ({
  liveStreamers,
  activeTab,
  handleStreamClick,
}) => (
  <>
    {activeTab !== "offline" && liveStreamers.length > 0 && (
      <div className="bg-dark-800/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-live rounded-full animate-pulse"></div>
          <h3 className="text-white font-semibold">
            Live Now ({liveStreamers.length})
          </h3>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {liveStreamers.map((streamer) => (
            <div
              key={`live-${streamer.id}`}
              onClick={() => handleStreamClick(streamer.id)}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={streamer.avatar}
                  alt={streamer.displayName}
                  className="w-12 h-12 rounded-full border-2 border-live group-hover:border-white transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-live rounded-full border-2 border-dark-900"></div>
              </div>
              <div className="text-center mt-2">
                <div className="text-white text-xs font-semibold group-hover:text-primary-300 transition-colors">
                  {streamer.displayName}
                </div>
                <div className="text-dark-400 text-xs">
                  {streamer.stream?.viewers?.toLocaleString()} viewers
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);

export default LiveStreamersQuickAccess;
