import React from "react";
import useBrowse from "./useBrowse";
import BrowseHeader from "./BrowseHeader";
import BrowseFilters from "./BrowseFilters";
import BrowseCategories from "./BrowseCategories";
import BrowseResultsSummary from "./BrowseResultsSummary";
import BrowseStreamsList from "./BrowseStreamsList";

const Browse = () => {
  const {
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredStreams,
    handleCategorySelect,
    handleStreamClick,
  } = useBrowse();

  return (
    <div className="p-6 space-y-6">
      <BrowseHeader viewMode={viewMode} setViewMode={setViewMode} />
      <BrowseFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <BrowseCategories
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategorySelect={handleCategorySelect}
      />
      <BrowseResultsSummary
        filteredStreams={filteredStreams}
        selectedCategory={selectedCategory}
        categories={categories}
      />
      <BrowseStreamsList
        filteredStreams={filteredStreams}
        viewMode={viewMode}
        handleStreamClick={handleStreamClick}
      />
    </div>
  );
};

export default Browse;
