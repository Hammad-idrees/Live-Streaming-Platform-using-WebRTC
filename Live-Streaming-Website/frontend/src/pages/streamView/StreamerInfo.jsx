import React from "react";
import { Users, MapPin, Calendar, Star, Crown } from "lucide-react";

const StreamerInfo = ({ streamData, formatNumber }) => (
  <div className="flex items-center gap-4">
    <div className="relative">
      <img
        src={streamData.streamer.avatar}
        alt={streamData.streamer.displayName}
        className="w-16 h-16 rounded-full border-2 border-primary-600"
      />
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-live rounded-full border-2 border-dark-900 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-white font-semibold text-lg">
          {streamData.streamer.displayName}
        </h3>
        {streamData.streamer.isVerified && (
          <Star size={16} className="text-blue-400" />
        )}
        {streamData.streamer.isPremium && (
          <Crown size={16} className="text-yellow-400" />
        )}
      </div>
      <div className="flex items-center gap-4 text-dark-400 text-sm">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {formatNumber(streamData.streamer.followers)} followers
        </span>
        {streamData.streamer.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {streamData.streamer.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          Joined {new Date(streamData.streamer.joinedDate).getFullYear()}
        </span>
      </div>
    </div>
  </div>
);

export default StreamerInfo;
