import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { categories, allStreams } from "./browseData";

export default function useBrowse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("viewers");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort streams
  const filteredStreams = allStreams
    .filter((stream) => {
      const matchesCategory =
        selectedCategory === "all" ||
        stream.category.toLowerCase() === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.streamer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "viewers":
          return b.viewers - a.viewers;
        case "recent":
          return b.startTime - a.startTime;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleStreamClick = (streamId) => {
    navigate(`/stream/${streamId}`);
  };

  return {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredStreams,
    handleCategorySelect,
    handleStreamClick,
  };
}
