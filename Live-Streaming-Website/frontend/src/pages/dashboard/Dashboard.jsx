import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  TrendingUp,
  Users,
  Clock,
  Gamepad2,
  Music,
  Palette,
  ChefHat,
  Monitor,
  Dumbbell,
} from "lucide-react";

import StreamCard from "../../components/ui/StreamCard";
import Button from "../../components/ui/Button";
import DashboardQuickStats from "./DashboardQuickStats";
import FeaturedStreamBanner from "./FeaturedStreamBanner";
import LiveStreamsList from "./LiveStreamsList";
import DashboardCategories from "./DashboardCategories";
import useDashboard from "./useDashboard";

const Dashboard = ({ currentView, onViewChange }) => {
  const navigate = useNavigate();
  const {
    featuredStream,
    setFeaturedStream,
    liveStreams,
    categories,
    quickStats,
    handleStreamClick,
    handleCategoryClick,
  } = useDashboard();

  // Wrap handlers to inject navigate
  const handleStreamClickWithNav = (streamId) =>
    handleStreamClick(navigate, streamId);
  const handleCategoryClickWithNav = (categoryName) =>
    handleCategoryClick(navigate, categoryName);

  // Auto-rotate featured stream
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedStream((prev) => (prev + 1) % Math.min(liveStreams.length, 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case "browse":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">
              Browse All Streams
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {liveStreams.map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onClick={() => handleStreamClickWithNav(stream.id)}
                />
              ))}
            </div>
          </div>
        );

      case "following":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Following</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {liveStreams.slice(0, 4).map((stream) => (
                <StreamCard
                  key={stream.id}
                  stream={stream}
                  onClick={() => handleStreamClickWithNav(stream.id)}
                />
              ))}
            </div>
          </div>
        );

      case "library":
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>
            <div className="text-center py-12">
              <p className="text-dark-400 text-lg">
                Your saved streams and collections will appear here
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 space-y-8">
            {/* Quick Stats */}
            <DashboardQuickStats quickStats={quickStats} />

            {/* Featured Stream Banner */}
            <FeaturedStreamBanner
              liveStreams={liveStreams}
              featuredStream={featuredStream}
              setFeaturedStream={setFeaturedStream}
              handleStreamClick={handleStreamClickWithNav}
            />

            {/* Live Now Section */}
            <LiveStreamsList
              liveStreams={liveStreams}
              onViewChange={onViewChange}
              handleStreamClick={handleStreamClickWithNav}
            />

            {/* Categories Section */}
            <DashboardCategories
              categories={categories}
              handleCategoryClick={handleCategoryClickWithNav}
            />

            {/* Trending Streamers */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Trending Streamers
                </h2>
                <Button variant="ghost">View All</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {liveStreams.slice(0, 4).map((stream, index) => (
                  <div
                    key={stream.id}
                    className="bg-dark-800/50 rounded-xl p-4 border border-dark-700 hover:border-primary-600 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={stream.avatar}
                          alt={stream.streamer}
                          className="w-12 h-12 rounded-full border-2 border-primary-600"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(stream.streamer) +
                              "&background=0D8ABC&color=fff&size=60";
                          }}
                        />
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold group-hover:text-primary-300 transition-colors">
                          {stream.streamer}
                        </div>
                        <div className="text-dark-400 text-sm">
                          {stream.category}
                        </div>
                        <div className="text-dark-500 text-xs">
                          {stream.viewers.toLocaleString()} viewers
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return <div className="min-h-screen bg-dark-950">{renderContent()}</div>;
};

export default Dashboard;
