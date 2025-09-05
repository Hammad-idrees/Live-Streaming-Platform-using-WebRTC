import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { analytics, categories, availableTags } from "./streamStudio.data";

export function useStreamStudio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showStreamKeyModal, setShowStreamKeyModal] = useState(false);
  const [streamSettings, setStreamSettings] = useState({
    title: "",
    category: "Gaming",
    tags: [],
    description: "",
    thumbnail: null,
    recordStream: true,
  });
  const [streamStats, setStreamStats] = useState({
    viewerCount: 0,
    followers: user?.followers || 0,
    likes: 0,
    messages: 0,
    uptime: "00:00:00",
    bitrate: "6000 kbps",
    fps: "60 FPS",
    resolution: "1920x1080",
    droppedFrames: 0,
  });

  // Mock stream key
  const streamKey = `sk_${user?.id}_live_${Math.random()
    .toString(36)
    .substring(7)}`;
  const streamUrl = `rtmp://live.streamvibe.com/live/${streamKey}`;

  const handleToggleLive = (newIsLive) => {
    setIsLive(newIsLive);
    if (newIsLive) {
      setStreamStats((prev) => ({
        ...prev,
        viewerCount: 0,
        likes: 0,
        messages: 0,
        uptime: "00:00:00",
      }));
    }
  };

  const handleStreamSettingChange = (key, value) => {
    setStreamSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddTag = (tag) => {
    if (!streamSettings.tags.includes(tag) && streamSettings.tags.length < 5) {
      setStreamSettings((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setStreamSettings((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    // You could add a toast notification here
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "stream", label: "Stream Setup" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return {
    isLive,
    setIsLive,
    activeTab,
    setActiveTab,
    showStreamKeyModal,
    setShowStreamKeyModal,
    streamSettings,
    setStreamSettings,
    streamStats,
    setStreamStats,
    analytics,
    categories,
    availableTags,
    streamKey,
    streamUrl,
    handleToggleLive,
    handleStreamSettingChange,
    handleAddTag,
    handleRemoveTag,
    copyStreamKey,
    tabs,
  };
}
