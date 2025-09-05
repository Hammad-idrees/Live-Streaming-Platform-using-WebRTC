import React from "react";

const SidebarDiscover = ({
  discover,
  currentView,
  onViewChange,
  navigate,
  viewToRoute,
}) => (
  <div>
    <h3 className="text-dark-400 text-sm font-medium mb-3 px-3">Discover</h3>
    <div className="space-y-1">
      {discover.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            onViewChange(item.id);
            if (viewToRoute[item.id]) {
              navigate(viewToRoute[item.id]);
            }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
            currentView === item.id
              ? "bg-primary-600/20 text-primary-300"
              : "text-dark-300 hover:text-white hover:bg-dark-800"
          }`}
        >
          <item.icon size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">{item.name}</span>
        </button>
      ))}
    </div>
  </div>
);

export default SidebarDiscover;
