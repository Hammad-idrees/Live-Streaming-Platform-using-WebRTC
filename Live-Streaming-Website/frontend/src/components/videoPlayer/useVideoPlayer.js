import { useState, useRef, useEffect } from "react";
import { qualities, latencyOptions } from "./videoPlayer.data";

export function useVideoPlayer({ isLive = true, viewerCount = 0 }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("excellent");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("1080p");
  const [latency, setLatency] = useState("Low");
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setBuffering(true);
    const handleCanPlay = () => setBuffering(false);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current;
    if (!video) return;
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const getConnectionIcon = (Wifi, WifiOff) => {
    switch (connectionQuality) {
      case "excellent":
        return <Wifi className="text-green-400" size={16} />;
      case "good":
        return <Wifi className="text-yellow-400" size={16} />;
      case "poor":
        return <Wifi className="text-red-400" size={16} />;
      case "offline":
        return <WifiOff className="text-red-400" size={16} />;
      default:
        return <Wifi className="text-green-400" size={16} />;
    }
  };

  const formatViewerCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count.toString();
  };

  return {
    videoRef,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isFullscreen,
    setIsFullscreen,
    showControls,
    setShowControls,
    buffering,
    setBuffering,
    connectionQuality,
    setConnectionQuality,
    showSettings,
    setShowSettings,
    selectedQuality,
    setSelectedQuality,
    latency,
    setLatency,
    controlsTimeoutRef,
    togglePlay,
    handleVolumeChange,
    toggleMute,
    toggleFullscreen,
    handleMouseMove,
    getConnectionIcon,
    formatViewerCount,
    qualities,
    latencyOptions,
    isLive,
    viewerCount,
  };
}
