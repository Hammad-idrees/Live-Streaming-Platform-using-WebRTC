import React from "react";
import { useStreamStudio } from "./useStreamStudio";
import DashboardTab from "./DashboardTab";
import StreamTab from "./StreamTab";
import AnalyticsTab from "./AnalyticsTab";
import SettingsTab from "./SettingsTab";

const StreamStudio = () => {
  const {
    isLive,
    activeTab,
    setActiveTab,
    setShowStreamKeyModal,
    streamSettings,
    setStreamSettings,
    streamStats,

    analytics,
    categories,
    availableTags,
    streamKey,
    streamUrl,
    handleToggleLive,
    handleStreamSettingChange,
    handleAddTag,
    handleRemoveTag,
    tabs,
  } = useStreamStudio();

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex gap-4 p-4 border-b border-dark-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-dark-800 text-white"
                : "bg-dark-700 text-dark-300"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && (
          <DashboardTab
            streamStats={streamStats}
            analytics={analytics}
            setActiveTab={setActiveTab}
            setShowStreamKeyModal={setShowStreamKeyModal}
          />
        )}
        {activeTab === "stream" && (
          <StreamTab
            streamSettings={streamSettings}
            setStreamSettings={setStreamSettings}
            categories={categories}
            availableTags={availableTags}
            handleStreamSettingChange={handleStreamSettingChange}
            handleAddTag={handleAddTag}
            handleRemoveTag={handleRemoveTag}
            isLive={isLive}
            handleToggleLive={handleToggleLive}
            streamUrl={streamUrl}
            streamKey={streamKey}
            setShowStreamKeyModal={setShowStreamKeyModal}
            streamStats={streamStats}
          />
        )}
        {activeTab === "analytics" && <AnalyticsTab analytics={analytics} />}
        {activeTab === "settings" && (
          <SettingsTab
            streamSettings={streamSettings}
            setStreamSettings={setStreamSettings}
            handleStreamSettingChange={handleStreamSettingChange}
          />
        )}
      </div>
    </div>
  );
};

export default StreamStudio;
