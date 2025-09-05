import React from "react";

const DashboardCategories = ({ categories, handleCategoryClick }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Browse Categories</h2>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => handleCategoryClick(category.name)}
          className={`bg-dark-800/50 hover:bg-dark-700 rounded-xl p-6 text-center cursor-pointer transition-all hover:scale-105 border border-dark-700 hover:${category.borderColor} group ${category.bgColor}`}
        >
          <div
            className={`mb-4 flex justify-center group-hover:scale-110 transition-transform ${category.color}`}
          >
            <category.icon size={32} />
          </div>
          <h3 className="text-white font-semibold mb-1 group-hover:text-primary-300 transition-colors">
            {category.name}
          </h3>
          <p className="text-dark-400 text-sm">{category.count}</p>
          <p className="text-dark-500 text-xs">{category.viewers}</p>
        </button>
      ))}
    </div>
  </div>
);

export default DashboardCategories;
