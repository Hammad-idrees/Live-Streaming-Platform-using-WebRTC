import React from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
} from "lucide-react";

const VideoPlayerControls = ({
  isPlaying,
  togglePlay,
  isLive,
  toggleMute,
  isMuted,
  volume,
  handleVolumeChange,
  showSettings,
  setShowSettings,
  qualities,
  selectedQuality,
  setSelectedQuality,
  latencyOptions,
  latency,
  setLatency,
  isFullscreen,
  toggleFullscreen,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="text-white hover:text-primary-400 transition-colors"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      {/* Skip Back/Forward (for VODs) */}
      {!isLive && (
        <>
          <button className="text-white hover:text-primary-400 transition-colors">
            <SkipBack size={18} />
          </button>
          <button className="text-white hover:text-primary-400 transition-colors">
            <SkipForward size={18} />
          </button>
        </>
      )}
      {/* Refresh (for live streams) */}
      {isLive && (
        <button className="text-white hover:text-primary-400 transition-colors">
          <RotateCcw size={18} />
        </button>
      )}
      {/* Volume */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-white hover:text-primary-400 transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
          )}
        </button>
        <div className="group relative">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {/* Quality/Settings */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-white hover:text-primary-400 transition-colors"
        >
          <Settings size={18} />
        </button>
        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b border-dark-700">
              <h4 className="text-white font-medium text-sm">Quality</h4>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {qualities.map((quality) => (
                <button
                  key={quality}
                  onClick={() => {
                    setSelectedQuality(quality);
                    setShowSettings(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    selectedQuality === quality
                      ? "bg-primary-600 text-white"
                      : "text-gray-300 hover:bg-dark-700 hover:text-white"
                  }`}
                >
                  {quality}
                  {selectedQuality === quality && (
                    <span className="float-right">✓</span>
                  )}
                </button>
              ))}
            </div>
            {isLive && (
              <>
                <div className="p-3 border-b border-dark-700 border-t">
                  <h4 className="text-white font-medium text-sm">Latency</h4>
                </div>
                <div>
                  {latencyOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setLatency(option);
                        setShowSettings(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        latency === option
                          ? "bg-primary-600 text-white"
                          : "text-gray-300 hover:bg-dark-700 hover:text-white"
                      }`}
                    >
                      {option}
                      {latency === option && (
                        <span className="float-right">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Fullscreen */}
      <button
        onClick={toggleFullscreen}
        className="text-white hover:text-primary-400 transition-colors"
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  </div>
);

export default VideoPlayerControls;
