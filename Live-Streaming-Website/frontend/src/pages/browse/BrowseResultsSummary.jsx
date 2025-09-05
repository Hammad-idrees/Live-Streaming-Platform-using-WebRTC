import React from "react";
import { TrendingUp } from "lucide-react";

const BrowseResultsSummary = ({
  filteredStreams,
  selectedCategory,
  categories,
}) => (
  <div className="flex items-center justify-between">
    <div className="text-dark-400">
      Showing {filteredStreams.length} live{" "}
      {filteredStreams.length === 1 ? "stream" : "streams"}
      {selectedCategory !== "all" && (
        <span>
          {" "}
          in {categories.find((c) => c.id === selectedCategory)?.name}
        </span>
      )}
    </div>
    <div className="flex items-center gap-2 text-dark-400 text-sm">
      <TrendingUp size={14} />
      <span>
        {filteredStreams
          .reduce((sum, stream) => sum + stream.viewers, 0)
          .toLocaleString()}{" "}
        total viewers
      </span>
    </div>
  </div>
);

export default BrowseResultsSummary;
