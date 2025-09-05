import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { Search, Grid, List, Play, Eye, Clock, SortAsc } from "lucide-react";

const Library = () => {
  const [vods, setVods] = useState([]);
  const [filteredVods, setFilteredVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    const fetchVods = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/vod`);
        const data = await res.json();
        if (data.success) {
          const processedVods = data.data.map((vod) => {
            let videoUrl = vod.url || "";
            if (videoUrl && !videoUrl.startsWith("http")) {
              videoUrl = `${BASE_URL}${
                videoUrl.startsWith("/") ? "" : "/"
              }${videoUrl}`;
            }
            return {
              ...vod,
              videoUrl,
              viewCount: typeof vod.viewCount === "number" ? vod.viewCount : 0,
              likes: vod.likes || 0,
              dislikes: vod.dislikes || 0,
              comments: vod.comments || 0,
            };
          });
          setVods(processedVods);
          setFilteredVods(processedVods);
        } else {
          setError(data.error || "Failed to fetch VODs");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching VODs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVods();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredVods(vods);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const res = await fetch(
        `${BASE_URL}/api/v1/vod/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (data.success) {
        const processedVods = data.data.map((vod) => {
          let videoUrl = vod.url || "";
          if (videoUrl && !videoUrl.startsWith("http")) {
            videoUrl = `${BASE_URL}${
              videoUrl.startsWith("/") ? "" : "/"
            }${videoUrl}`;
          }
          return {
            ...vod,
            videoUrl,
            viewCount: typeof vod.viewCount === "number" ? vod.viewCount : 0,
            likes: vod.likes || 0,
            dislikes: vod.dislikes || 0,
            comments: vod.comments || 0,
          };
        });
        setFilteredVods(processedVods);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
      });

      setError(err.message || "An error occurred during search");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayPause = (vodId) => {
    if (playingVideo === vodId) {
      setPlayingVideo(null);
    } else {
      setPlayingVideo(vodId);
    }
  };

  const handleFullscreenToggle = (vodId) => {
    if (fullscreenVideo === vodId) {
      setFullscreenVideo(null);
    } else {
      setFullscreenVideo(vodId);
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const sortVideos = (videos, sortType) => {
    const sorted = [...videos];
    switch (sortType) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "mostViewed":
        return sorted.sort((a, b) => b.viewCount - a.viewCount);
      case "mostLiked":
        return sorted.sort((a, b) => b.likes - a.likes);
      case "alphabetical":
        return sorted.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
      default:
        return sorted;
    }
  };

  const sortedVods = sortVideos(filteredVods, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          {/* Title and Stats Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold text-white mb-2">
                Your Library
              </h1>
              <div className="flex items-center gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-blue-400" />
                  <span className="font-medium">
                    {sortedVods.length} Videos
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-green-400" />
                  <span className="font-medium">
                    {sortedVods
                      .reduce((acc, vod) => acc + vod.viewCount, 0)
                      .toLocaleString()}{" "}
                    Total Views
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-purple-400" />
                  <span className="font-medium">Updated Recently</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos by title, description, or tags..."
                className="w-full pl-12 pr-20 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {/* Filter and View Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 text-white px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostViewed">Most Viewed</option>
                  <option value="mostLiked">Most Liked</option>
                  <option value="alphabetical">A-Z</option>
                </select>
                <SortAsc
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 transition-colors ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 transition-colors ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                  title="List View"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 text-red-300 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Active filters:</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-900/30 border border-blue-700/50 rounded-full text-blue-300 text-sm">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilteredVods(vods);
                }}
                className="ml-1 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        {sortedVods.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play size={36} className="text-gray-500" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              {searchQuery
                ? "No matching videos found"
                : "No videos in your library"}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {searchQuery
                ? "Try adjusting your search terms or browse all videos by clearing the search."
                : "Start building your video library by uploading your first video."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilteredVods(vods);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Clear Search & Show All Videos
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Video Grid - Exactly 3 per row */}
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                  : "space-y-6"
              }`}
            >
              {sortedVods.map((vod) => (
                <div
                  key={vod._id}
                  className={`${
                    viewMode === "list"
                      ? "bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800/70 transition-all"
                      : "bg-gray-800/30 border border-gray-700/30 rounded-lg overflow-hidden hover:bg-gray-800/50 hover:border-gray-600/50 transition-all duration-300"
                  }`}
                >
                  <VideoCard
                    vod={vod}
                    isPlaying={playingVideo === vod._id}
                    isFullscreen={fullscreenVideo === vod._id}
                    onPlayPause={handlePlayPause}
                    onFullscreenToggle={handleFullscreenToggle}
                    formatCount={formatCount}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {/* Results Footer */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-400">
                  Showing{" "}
                  <span className="text-white font-medium">
                    {sortedVods.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-medium">{vods.length}</span>{" "}
                  videos
                  {searchQuery && (
                    <span>
                      {" "}
                      matching "
                      <span className="text-blue-400">{searchQuery}</span>"
                    </span>
                  )}
                </p>

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilteredVods(vods);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    View All Videos
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;
