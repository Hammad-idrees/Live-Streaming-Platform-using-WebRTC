import React from "react";

const DashboardQuickStats = ({ quickStats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {quickStats.map((stat, index) => (
      <div
        key={index}
        className="bg-dark-800/50 rounded-xl p-4 border border-dark-700"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-dark-700 ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <div className="text-white font-bold text-xl">{stat.value}</div>
            <div className="text-dark-400 text-sm">{stat.label}</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default DashboardQuickStats;
