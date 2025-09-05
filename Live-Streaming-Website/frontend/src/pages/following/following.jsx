import React from "react";
import useFollowing from "./useFollowing";
import FollowingHeader from "./FollowingHeader";
import FollowingFilters from "./FollowingFilters";
import FollowingTabs from "./FollowingTabs";
import LiveStreamersQuickAccess from "./LiveStreamersQuickAccess";
import FollowingList from "./FollowingList";

const Following = () => {
  const {
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
    handleStreamClick,
    handleProfileClick,
    toggleNotifications,
    handleUnfollow,
    tabs,
  } = useFollowing();

  return (
    <div className="p-6 space-y-6">
      <FollowingHeader viewMode={viewMode} setViewMode={setViewMode} />
      <FollowingFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <FollowingTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <LiveStreamersQuickAccess
        liveStreamers={liveStreamers}
        activeTab={activeTab}
        handleStreamClick={handleStreamClick}
      />
      <FollowingList
        filteredStreamers={filteredStreamers}
        viewMode={viewMode}
        handleStreamClick={handleStreamClick}
        handleProfileClick={handleProfileClick}
        toggleNotifications={toggleNotifications}
        handleUnfollow={handleUnfollow}
      />
    </div>
  );
};

export default Following;
