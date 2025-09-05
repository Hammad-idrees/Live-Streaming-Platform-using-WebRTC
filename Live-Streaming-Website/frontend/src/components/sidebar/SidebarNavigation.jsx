import React from "react";

const SidebarNavigation = ({
  navigation,
  currentView,
  onViewChange,
  navigate,
  viewToRoute,
  isOpen,
}) => (
  <nav className="space-y-2">
    {navigation.map((item) => (
      <button
        key={item.id}
        onClick={() => {
          onViewChange(item.id);
          if (viewToRoute[item.id]) {
            navigate(viewToRoute[item.id]);
          }
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
          currentView === item.id
            ? "bg-primary-600/20 text-primary-300 border-r-2 border-primary-500"
            : "text-dark-300 hover:text-white hover:bg-dark-800"
        } ${!isOpen ? "justify-center" : ""}`}
        title={!isOpen ? item.name : ""}
      >
        <item.icon size={20} className="flex-shrink-0" />
        {isOpen && (
          <>
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <span className="ml-auto bg-live text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    ))}
  </nav>
);

export default SidebarNavigation;
