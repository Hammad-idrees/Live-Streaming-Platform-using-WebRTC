import React from "react";

const FollowingTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="flex gap-1 bg-dark-800 rounded-lg p-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all ${
          activeTab === tab.id
            ? "bg-primary-600 text-white"
            : "text-dark-300 hover:text-white hover:bg-dark-700"
        }`}
      >
        <span className="font-medium">{tab.label}</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            activeTab === tab.id ? "bg-white/20" : "bg-dark-600"
          }`}
        >
          {tab.count}
        </span>
      </button>
    ))}
  </div>
);

export default FollowingTabs;
