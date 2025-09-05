import React from "react";

const BrowseCategories = ({
  categories,
  selectedCategory,
  handleCategorySelect,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-white">Categories</h2>
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategorySelect(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            selectedCategory === category.id
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white"
          }`}
        >
          <category.icon size={16} className={category.color} />
          <span className="font-medium">{category.name}</span>
          <span className="text-xs opacity-75">({category.count})</span>
        </button>
      ))}
    </div>
  </div>
);

export default BrowseCategories;
