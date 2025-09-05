import React from "react";

const SidebarCategories = ({ categories }) => (
  <div>
    <h3 className="text-dark-400 text-sm font-medium mb-3 px-3">Categories</h3>
    <div className="space-y-1">
      {categories.map((category) => (
        <button
          key={category.name}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-all group"
        >
          <category.icon
            size={18}
            className={`flex-shrink-0 ${category.color} group-hover:scale-110 transition-transform`}
          />
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-medium truncate group-hover:text-white transition-colors">
              {category.name}
            </div>
            <div className="text-xs text-dark-500 truncate">
              {category.count} live • {category.viewers} viewers
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default SidebarCategories;
