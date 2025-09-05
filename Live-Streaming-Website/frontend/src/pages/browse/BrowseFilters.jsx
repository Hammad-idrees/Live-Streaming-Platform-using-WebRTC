import React from "react";
import Button from "../../components/ui/Button";
import { Search, Filter } from "lucide-react";

const BrowseFilters = ({ searchQuery, setSearchQuery, sortBy, setSortBy }) => (
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1 relative">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search streams, creators..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
    <div className="flex gap-3">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="viewers">Most Viewers</option>
        <option value="recent">Recently Started</option>
        <option value="title">Alphabetical</option>
      </select>
      <Button variant="ghost" icon={<Filter />}>
        Filters
      </Button>
    </div>
  </div>
);

export default BrowseFilters;
