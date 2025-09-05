import React from "react";
import { Wifi, WifiOff, Users, Heart, Share2, Flag } from "lucide-react";
import { useVideoPlayer } from "./useVideoPlayer";
import VideoPlayerControls from "./VideoPlayerControls";

const VideoPlayer = ({
  streamUrl,
  thumbnail,
  isLive = true,
  streamTitle,
  streamerName,
  viewerCount = 0,
  onViewerCountUpdate,
}) => {
  const {
    videoRef,
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    showControls,
    buffering,
    connectionQuality,
    showSettings,
    selectedQuality,
    latency,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    handleMouseMove,
    getConnectionIcon,
    formatViewerCount,
    qualities,
    latencyOptions,
    setShowSettings,
    setSelectedQuality,
    setLatency,
    setShowControls,
  } = useVideoPlayer({ isLive, viewerCount });

  return (
    <div
      className="relative bg-black rounded-xl overflow-hidden group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={thumbnail}
        playsInline
        onClick={togglePlay}
      >
        <source src={streamUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Buffering Indicator */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Live Indicator & Stats Overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        {isLive && (
          <div className="bg-live px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-bold">LIVE</span>
          </div>
        )}
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
          <Users size={14} className="text-white" />
          <span className="text-white text-sm font-medium">
            {formatViewerCount(viewerCount)}
          </span>
        </div>
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
          {getConnectionIcon(Wifi, WifiOff)}
          <span className="text-white text-xs capitalize">
            {connectionQuality}
          </span>
        </div>
      </div>

      {/* Top Right Actions */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button className="bg-black/70 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 transition-colors">
          <Heart size={16} className="text-white" />
        </button>
        <button className="bg-black/70 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 transition-colors">
          <Share2 size={16} className="text-white" />
        </button>
        <button className="bg-black/70 backdrop-blur-sm p-2 rounded-full hover:bg-black/90 transition-colors">
          <Flag size={16} className="text-white" />
        </button>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && !buffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-black/70 backdrop-blur-sm p-6 rounded-full hover:bg-black/90 transition-all hover:scale-110"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 3v18l15-9L5 3z" />
            </svg>
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="p-4 space-y-3">
          {/* Stream Info */}
          <div className="text-white">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {streamTitle}
            </h3>
            <p className="text-gray-300 text-sm">{streamerName}</p>
          </div>
          {/* Controls Row */}
          <VideoPlayerControls
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            isLive={isLive}
            toggleMute={toggleMute}
            isMuted={isMuted}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            qualities={qualities}
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
            latencyOptions={latencyOptions}
            latency={latency}
            setLatency={setLatency}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
        ></div>
      )}
    </div>
  );
};

export default VideoPlayer;
