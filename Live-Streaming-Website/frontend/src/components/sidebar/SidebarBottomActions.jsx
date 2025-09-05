import React from "react";
import { Video, Star, Settings } from "lucide-react";

const SidebarBottomActions = ({ user, isOpen, onViewChange, navigate }) => (
  <div className="p-4 border-t border-dark-800 flex-shrink-0">
    {isOpen ? (
      <div className="space-y-3">
        {user?.isStreamer ? (
          <button className="w-full bg-live hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
            <Video size={18} />
            Go Live
          </button>
        ) : (
          <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2">
            <Star size={18} />
            Become a Streamer
          </button>
        )}
        <button
          onClick={() => {
            onViewChange("settings");
            navigate("/settings");
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    ) : (
      <div className="space-y-3 flex flex-col items-center">
        {user?.isStreamer ? (
          <button
            className="w-12 h-12 bg-live hover:bg-red-600 text-white rounded-lg transition-all hover:scale-105 flex items-center justify-center"
            title="Go Live"
          >
            <Video size={20} />
          </button>
        ) : (
          <button
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all hover:scale-105 flex items-center justify-center"
            title="Become a Streamer"
          >
            <Star size={20} />
          </button>
        )}
        <button
          onClick={() => {
            onViewChange("settings");
            navigate("/settings");
          }}
          className="w-12 h-12 flex items-center justify-center rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    )}
  </div>
);

export default SidebarBottomActions;
