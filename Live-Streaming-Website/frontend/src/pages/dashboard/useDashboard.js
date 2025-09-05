import { useState, useEffect, useCallback } from "react";
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

// (In a real app, replace this with API calls)
import { liveStreams, categories, quickStats } from "./dashboardData";

export default function useDashboard() {
  const [featuredStream, setFeaturedStream] = useState(0);

  // Auto-rotate featured stream
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedStream((prev) => (prev + 1) % Math.min(liveStreams.length, 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handlers (to be passed to components)
  const handleStreamClick = useCallback((navigate, streamId) => {
    navigate(`/stream/${streamId}`);
  }, []);

  const handleCategoryClick = useCallback((navigate, categoryName) => {
    navigate(`/browse?category=${categoryName.toLowerCase()}`);
  }, []);

  return {
    featuredStream,
    setFeaturedStream,
    liveStreams,
    categories,
    quickStats,
    handleStreamClick,
    handleCategoryClick,
  };
}
