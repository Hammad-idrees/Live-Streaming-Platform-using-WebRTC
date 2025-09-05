import React, { useState } from "react";
import {
  Camera,
  Crown,
  Star,
  Shield,
  MapPin,
  Link,
  Calendar,
  Globe,
} from "lucide-react";

const ProfileCard = ({
  user,
  isEditing,
  handleAvatarClick,
  fileInputRef,
  handleFileChange,
  avatarPreview,
  getAvatarSrc,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const Badge = ({ icon: Icon, label, color, bgColor }) => (
    <div
      className={`flex items-center gap-1 ${bgColor} ${color} px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg`}
    >
      <Icon size={12} className="animate-pulse" />
      {label}
    </div>
  );

  const StatCard = ({ value, label, delay }) => (
    <div
      className="text-center p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-live/50 transition-all duration-300 hover:shadow-lg hover:shadow-live/10 hover:scale-105 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-2xl font-bold text-live transition-all duration-300 group-hover:text-white group-hover:scale-110">
        {Array.isArray(value) ? value.length : value || 0}
      </div>
      <div className="text-dark-400 text-sm font-medium transition-colors duration-300 group-hover:text-dark-300">
        {label}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-dark-800 rounded-xl p-6 border border-dark-800 hover:border-live/30 transition-all duration-500 hover:shadow-2xl hover:shadow-live/20 group">
      {/* Avatar Section */}
      <div className="text-center mb-6">
        <div className="relative inline-block mx-auto">
          <div
            className="w-32 h-32 mx-auto relative p-1 transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated border */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-live via-red-500 to-live rounded-full transition-all duration-300 ${
                isHovered ? "animate-spin" : ""
              }`}
            ></div>
            <div className="absolute inset-1 bg-dark-900 rounded-full"></div>

            <img
              src={getAvatarSrc()}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover object-center object-top relative z-10 transition-all duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-1 bg-dark-800 rounded-full animate-pulse z-10"></div>
            )}

            {isEditing && (
              <button
                onClick={handleAvatarClick}
                className="absolute bottom-2 right-2 bg-gradient-to-r from-live to-red-500 hover:from-red-500 hover:to-live text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl z-20 group"
              >
                <Camera
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-12"
                />
              </button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* User Info */}
        <div className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-bold text-white mt-4 transition-all duration-300 group-hover:text-live">
            {user?.username || "Username"}
          </h2>
          <p className="text-dark-400 text-sm">
            @{user?.username || "username"}
          </p>
        </div>

        {/* User Badges */}
        <div
          className="flex items-center justify-center gap-2 mt-4 flex-wrap animate-fadeInUp"
          style={{ animationDelay: "400ms" }}
        >
          {user?.isPremium && (
            <Badge
              icon={Crown}
              label="Premium"
              color="text-yellow-400"
              bgColor="bg-gradient-to-r from-yellow-500/20 to-orange-500/20"
            />
          )}
          {user?.role === "streamer" && (
            <Badge
              icon={Star}
              label="Streamer"
              color="text-blue-400"
              bgColor="bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            />
          )}
          <Badge
            icon={Shield}
            label={user?.role || "User"}
            color="text-dark-300"
            bgColor="bg-dark-700 hover:bg-dark-600"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div
        className="text-center mb-6 animate-fadeInUp"
        style={{ animationDelay: "600ms" }}
      >
        <div className="bg-dark-800/50 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-all duration-300">
          <p className="text-dark-300 text-sm leading-relaxed">
            {user?.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      {(user?.location || user?.website) && (
        <div
          className="space-y-2 mb-6 animate-fadeInUp"
          style={{ animationDelay: "800ms" }}
        >
          {user?.location && (
            <div className="flex items-center justify-center gap-2 text-dark-400 text-sm hover:text-dark-300 transition-colors duration-200">
              <MapPin size={14} />
              {user.location}
            </div>
          )}
          {user?.website && (
            <div className="flex items-center justify-center gap-2 text-dark-400 text-sm hover:text-live transition-colors duration-200">
              <Link size={14} />
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div
        className="grid grid-cols-2 gap-4 animate-fadeInUp"
        style={{ animationDelay: "1000ms" }}
      >
        <StatCard value={user?.followers} label="Followers" delay={1200} />
        <StatCard value={user?.following} label="Following" delay={1400} />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div className="absolute top-4 right-4 w-2 h-2 bg-live rounded-full animate-pulse opacity-50"></div>
        <div
          className="absolute bottom-4 left-4 w-1 h-1 bg-red-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-live rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;
