import React from "react";
import { Search } from "lucide-react";

const HeaderSearch = () => (
  <div className="relative">
    <Search
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400"
      size={18}
    />
    <input
      type="text"
      placeholder="Search streams, creators, categories..."
      className="bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 w-96 transition-all"
    />
  </div>
);

export default HeaderSearch;
