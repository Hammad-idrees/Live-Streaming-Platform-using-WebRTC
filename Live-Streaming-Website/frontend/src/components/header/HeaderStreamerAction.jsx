import React from "react";
import { Video, Star } from "lucide-react";

const HeaderStreamerAction = ({ user, onGoLive, onUpgradeClick }) =>
  user?.role === "streamer" ? (
    <button
      onClick={onGoLive}
      className="bg-live hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
    >
      <Video size={16} />
      Go Live
    </button>
  ) : (
    <button
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2"
      onClick={onUpgradeClick}
    >
      <Star size={16} />
      Become a Streamer
    </button>
  );

export default HeaderStreamerAction;
