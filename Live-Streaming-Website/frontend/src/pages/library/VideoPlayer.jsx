import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";

const VideoPlayer = ({
  vod,
  isHovered,
  isPlaying,
  isFullscreen,
  onPlayPause,
  onFullscreenToggle,
}) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState("Auto");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const qualityMenuRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !vod.videoUrl) return;

    if (vod.videoUrl.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 60,
          enableWorker: true,
          autoStartLoad: true,
          capLevelToPlayerSize: true,
        });
        hls.loadSource(vod.videoUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const qualities = [
            "Auto",
            ...hls.levels.map((level) => {
              const height =
                level.height || level.attrs?.RESOLUTION?.split("x")[1];
              return height
                ? `${height}p`
                : `${Math.round(level.bitrate / 1000)}k`;
            }),
          ];
          setAvailableQualities(qualities);
        });

        video.hls = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = vod.videoUrl;
      }
    } else {
      video.src = vod.videoUrl;
    }

    return () => {
      if (video?.hls) {
        video.hls.destroy();
      }
    };
  }, [vod]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.muted = muted;
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying, muted]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    onPlayPause(vod._id);
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted(!muted);
  };

  const handleQualityChange = (quality, e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video?.hls) {
      if (quality === "Auto") {
        video.hls.currentLevel = -1;
      } else {
        const levelIndex = video.hls.levels.findIndex((level) => {
          const height = level.height || level.attrs?.RESOLUTION?.split("x")[1];
          return height
            ? `${height}p` === quality
            : `${Math.round(level.bitrate / 1000)}k` === quality;
        });
        if (levelIndex !== -1) {
          video.hls.currentLevel = levelIndex;
        }
      }
      setCurrentQuality(quality);
    }
    setShowQualityMenu(false);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    onFullscreenToggle(vod._id);
  };

  const skipTime = (seconds, e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      video.currentTime = Math.max(
        0,
        Math.min(video.duration || 0, video.currentTime + seconds)
      );
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        qualityMenuRef.current &&
        !qualityMenuRef.current.contains(event.target)
      ) {
        setShowQualityMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden group-hover:shadow-lg transition-shadow">
      {vod.videoUrl ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover cursor-pointer"
            poster={vod.thumbnail}
            onClick={handlePlayPause}
            muted={muted}
          />

          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30">
              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all hover:scale-110 z-20 shadow-lg"
                >
                  {isPlaying ? (
                    <Pause size={24} fill="currentColor" />
                  ) : (
                    <Play size={24} fill="currentColor" className="ml-1" />
                  )}
                </button>
              </div>

              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-4">
                <div className="flex justify-between items-start">
                  <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                    {formatTime(videoRef.current?.currentTime)} /{" "}
                    {formatTime(videoRef.current?.duration)}
                  </div>
                  <button
                    onClick={toggleFullscreen}
                    className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all z-20"
                    title="Fullscreen"
                  >
                    <Maximize size={16} />
                  </button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="w-full bg-gray-600 h-1 rounded-full mb-3 overflow-hidden">
                  <div
                    className="bg-red-500 h-full transition-all duration-150"
                    style={{
                      width: `${
                        videoRef.current
                          ? (videoRef.current.currentTime /
                              (videoRef.current.duration || 1)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center">
                  {/* Left Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => skipTime(-10, e)}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all"
                      title="Skip back 10s"
                    >
                      <SkipBack size={16} />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>

                    <button
                      onClick={(e) => skipTime(10, e)}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all"
                      title="Skip forward 10s"
                    >
                      <SkipForward size={16} />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-all"
                    >
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  {/* Right Controls */}
                  <div className="flex items-center gap-2">
                    {/* Quality Selector */}
                    <div className="relative" ref={qualityMenuRef}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowQualityMenu(!showQualityMenu);
                        }}
                        className="bg-black/70 hover:bg-black/90 text-white px-3 py-2 rounded text-xs flex items-center gap-1 transition-all"
                      >
                        <Settings size={14} />
                        {currentQuality || "Auto"}
                      </button>
                      {showQualityMenu && availableQualities.length > 0 && (
                        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl min-w-20 z-50 overflow-hidden">
                          {availableQualities.map((quality) => (
                            <button
                              key={quality}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                currentQuality === quality
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              }`}
                              onClick={(e) => handleQualityChange(quality, e)}
                            >
                              {quality}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-t-lg">
          <p className="text-gray-400">No video available</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
