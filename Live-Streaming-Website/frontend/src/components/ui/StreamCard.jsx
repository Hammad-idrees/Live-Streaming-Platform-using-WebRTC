import React, { useState } from "react";
import {
  Eye,
  Heart,
  Share2,
  MoreVertical,
  Play,
  Clock,
  Users,
} from "lucide-react";

const StreamCard = ({
  stream,
  size = "default",
  showActions = true,
  onClick,
  className = "",
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Implement share functionality
    console.log("Share stream:", stream.id);
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const sizes = {
    small: {
      container: "max-w-xs",
      image: "aspect-video",
      avatar: "w-8 h-8",
      title: "text-sm",
      subtitle: "text-xs",
    },
    default: {
      container: "max-w-sm",
      image: "aspect-video",
      avatar: "w-10 h-10",
      title: "text-sm",
      subtitle: "text-sm",
    },
    large: {
      container: "max-w-md",
      image: "aspect-video",
      avatar: "w-12 h-12",
      title: "text-base",
      subtitle: "text-sm",
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={`group cursor-pointer ${sizeConfig.container} ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className={`w-full ${sizeConfig.image} object-cover transition-transform duration-300 group-hover:scale-105`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Live Badge */}
        <div className="absolute top-3 left-3 bg-live px-2 py-1 rounded-md text-white text-xs font-bold shadow-lg">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>
        </div>

        {/* Viewer Count */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs flex items-center gap-1">
          <Eye size={12} />
          {stream.viewers >= 1000
            ? `${(stream.viewers / 1000).toFixed(1)}K`
            : stream.viewers.toLocaleString()}
        </div>

        {/* Duration */}
        {stream.duration && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs flex items-center gap-1">
            <Clock size={12} />
            {stream.duration}
          </div>
        )}

        {/* Hover Actions */}
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 transition-all hover:scale-110 ${
                  isLiked ? "text-red-500" : "text-white"
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
              </button>
              <button
                onClick={handleShare}
                className="bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 transition-all hover:scale-110 text-white"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={() => onClick && onClick()}
                className="bg-live/80 backdrop-blur-sm p-3 rounded-full hover:bg-live transition-all hover:scale-110 text-white"
              >
                <Play size={18} fill="white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex gap-3">
          {/* Avatar */}
          <img
            src={stream.avatar}
            alt={stream.streamer}
            className={`${sizeConfig.avatar} rounded-full flex-shrink-0 border-2 border-transparent group-hover:border-primary-500 transition-colors`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(stream.streamer) +
                "&background=0D8ABC&color=fff&size=60";
            }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-white font-medium line-clamp-2 ${sizeConfig.title} leading-tight group-hover:text-primary-300 transition-colors`}
            >
              {stream.title}
            </h3>
            <p
              className={`text-dark-400 ${sizeConfig.subtitle} truncate group-hover:text-dark-300 transition-colors`}
            >
              {stream.streamer}
            </p>

            {/* Tags and Stats */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-block bg-primary-600/20 text-primary-300 px-2 py-0.5 rounded-md text-xs font-medium">
                {stream.category}
              </span>

              {stream.tags &&
                stream.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-dark-700 text-dark-300 px-2 py-0.5 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}

              <div className="flex items-center gap-1 text-dark-400 text-xs ml-auto">
                <Users size={12} />
                {stream.viewers >= 1000
                  ? `${(stream.viewers / 1000).toFixed(1)}K`
                  : stream.viewers.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Menu Button */}
          {showActions && (
            <div className="relative">
              <button
                onClick={handleMenuToggle}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-dark-400 hover:text-white"
              >
                <MoreVertical size={16} />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 top-8 z-50 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden">
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-dark-700 transition-colors text-sm">
                      Add to Watchlist
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-dark-700 transition-colors text-sm">
                      Follow Streamer
                    </button>
                    <button className="w-full px-4 py-2 text-left text-white hover:bg-dark-700 transition-colors text-sm">
                      Share Stream
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors text-sm">
                      Report Stream
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact version for sidebar or small spaces
export const CompactStreamCard = ({ stream, onClick }) => (
  <div
    className="flex items-center gap-3 p-3 hover:bg-dark-800 rounded-lg cursor-pointer transition-colors group"
    onClick={onClick}
  >
    <div className="relative flex-shrink-0">
      <img
        src={stream.thumbnail}
        alt={stream.title}
        className="w-16 h-10 object-cover rounded"
      />
      <div className="absolute top-1 left-1 bg-live px-1 py-0.5 rounded text-white text-xs font-bold">
        LIVE
      </div>
    </div>

    <div className="flex-1 min-w-0">
      <h4 className="text-white text-sm font-medium truncate group-hover:text-primary-300 transition-colors">
        {stream.title}
      </h4>
      <p className="text-dark-400 text-xs truncate">{stream.streamer}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-dark-500">{stream.category}</span>
        <span className="text-xs text-dark-500">•</span>
        <span className="text-xs text-dark-500">
          {stream.viewers.toLocaleString()}
        </span>
      </div>
    </div>
  </div>
);

export default StreamCard;
