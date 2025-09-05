import React, { useState } from "react";
import { Play, Heart, Share2, MoreVertical, Clock, User } from "lucide-react";

const VodCard = ({
  vod,
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
    console.log("Share VOD:", vod._id);
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
          src={vod.thumbnail}
          alt={vod.title}
          className={`w-full ${sizeConfig.image} object-cover transition-transform duration-300 group-hover:scale-105`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x338/222/fff?text=No+Image";
          }}
        />
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play
            size={40}
            className="text-blue-400 drop-shadow-lg"
            fill="currentColor"
          />
        </div>
        {/* Duration */}
        {vod.duration && (
          <div className="absolute bottom-3 right-3 bg-blue-700/80 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs flex items-center gap-1">
            <Clock size={12} />
            {vod.duration}
          </div>
        )}
        {/* Hover Actions */}
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 transition-all hover:scale-110 ${
                  isLiked ? "text-blue-400" : "text-white"
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
                className="bg-blue-600/80 backdrop-blur-sm p-3 rounded-full hover:bg-blue-600 transition-all hover:scale-110 text-white"
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
          {vod.user?.avatar ? (
            <img
              src={vod.user.avatar}
              alt={vod.user?.username}
              className={`${sizeConfig.avatar} rounded-full flex-shrink-0 border-2 border-transparent group-hover:border-blue-400 transition-colors`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(vod.user?.username || "Uploader") +
                  "&background=0D8ABC&color=fff&size=60";
              }}
            />
          ) : null}
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-white font-medium line-clamp-2 ${sizeConfig.title} leading-tight group-hover:text-blue-300 transition-colors`}
            >
              {vod.title}
            </h3>
            <p
              className={`text-dark-400 ${sizeConfig.subtitle} truncate group-hover:text-dark-300 transition-colors flex items-center gap-1`}
            >
              <User size={14} className="inline-block" />
              {vod.user?.username || "Uploader"}
            </p>
            {/* Category and Tags */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-block bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-md text-xs font-medium">
                {vod.category}
              </span>
              {vod.tags &&
                vod.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-dark-700 text-dark-300 px-2 py-0.5 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
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
                      Share Video
                    </button>
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors text-sm">
                      Report Video
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

export default VodCard;
