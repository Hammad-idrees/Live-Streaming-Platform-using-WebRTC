import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { followedStreamers } from "./followingData";

export default function useFollowing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const liveStreamers = followedStreamers.filter((streamer) => streamer.isLive);
  const offlineStreamers = followedStreamers.filter(
    (streamer) => !streamer.isLive
  );

  const getFilteredStreamers = () => {
    let streamers = [];
    switch (activeTab) {
      case "live":
        streamers = liveStreamers;
        break;
      case "offline":
        streamers = offlineStreamers;
        break;
      case "all":
        streamers = followedStreamers;
        break;
      default:
        streamers = followedStreamers;
    }
    // Filter by search query
    if (searchQuery) {
      streamers = streamers.filter(
        (streamer) =>
          streamer.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          streamer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (streamer.stream?.title || streamer.lastStream?.title || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    // Sort streamers
    streamers = [...streamers].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          if (a.isLive && b.isLive) {
            return b.stream.startTime - a.stream.startTime;
          }
          return b.isLive - a.isLive;
        case "viewers":
          return (b.stream?.viewers || 0) - (a.stream?.viewers || 0);
        case "alphabetical":
          return a.displayName.localeCompare(b.displayName);
        case "followed":
          return new Date(b.followedDate) - new Date(a.followedDate);
        default:
          return 0;
      }
    });
    return streamers;
  };

  const filteredStreamers = getFilteredStreamers();

  const handleStreamClick = (streamId) => {
    navigate(`/stream/${streamId}`);
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const toggleNotifications = (streamerId) => {
    // In real app, make API call to update notification preferences
    console.log("Toggle notifications for streamer:", streamerId);
  };

  const handleUnfollow = (streamerId) => {
    // In real app, make API call to unfollow
    console.log("Unfollow streamer:", streamerId);
  };

  const tabs = [
    { id: "live", label: "Live Now", count: liveStreamers.length },
    { id: "offline", label: "Offline", count: offlineStreamers.length },
    { id: "all", label: "All", count: followedStreamers.length },
  ];

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredStreamers,
    liveStreamers,
    offlineStreamers,
    handleStreamClick,
    handleProfileClick,
    toggleNotifications,
    handleUnfollow,
    tabs,
  };
}
