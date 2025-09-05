import React from "react";
import { useSidebar } from "./useSidebar";
import SidebarNavigation from "./SidebarNavigation";
import SidebarDiscover from "./SidebarDiscover";
import SidebarFollowed from "./SidebarFollowed";
import SidebarCategories from "./SidebarCategories";
import SidebarBottomActions from "./SidebarBottomActions";

const Sidebar = ({ isOpen, currentView, onViewChange }) => {
  const {
    user,
    navigation,
    discover,
    categories,
    followedStreamers,
    viewToRoute,
    navigate,
  } = useSidebar();

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-16"
      } bg-dark-900 border-r border-dark-800 transition-all duration-300 flex flex-col h-full overflow-hidden`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-dark-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-streaming rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Video icon can be added here if needed */}
          </div>
          {isOpen && (
            <h1 className="text-xl font-bold text-white">StreamVibe</h1>
          )}
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4 space-y-6">
          <SidebarNavigation
            navigation={navigation}
            currentView={currentView}
            onViewChange={onViewChange}
            navigate={navigate}
            viewToRoute={viewToRoute}
            isOpen={isOpen}
          />
          {isOpen && (
            <>
              <SidebarDiscover
                discover={discover}
                currentView={currentView}
                onViewChange={onViewChange}
                navigate={navigate}
                viewToRoute={viewToRoute}
              />
              <SidebarFollowed
                followedStreamers={followedStreamers}
                isOpen={isOpen}
              />
              <SidebarCategories categories={categories} />
            </>
          )}
        </div>
      </div>
      {/* Bottom Actions */}
      <SidebarBottomActions
        user={user}
        isOpen={isOpen}
        onViewChange={onViewChange}
        navigate={navigate}
      />
    </div>
  );
};

export default Sidebar;
