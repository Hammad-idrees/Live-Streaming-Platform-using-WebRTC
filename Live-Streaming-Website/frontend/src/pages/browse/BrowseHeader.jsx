import React from "react";
import Button from "../../components/ui/Button";
import { Grid3X3, List } from "lucide-react";

const BrowseHeader = ({ viewMode, setViewMode }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">
        Browse Live Streams
      </h1>
      <p className="text-dark-400">
        Discover amazing content from creators around the world
      </p>
    </div>
    <div className="flex items-center gap-3">
      <Button
        variant={viewMode === "grid" ? "primary" : "ghost"}
        onClick={() => setViewMode("grid")}
        icon={<Grid3X3 />}
        size="sm"
      />
      <Button
        variant={viewMode === "list" ? "primary" : "ghost"}
        onClick={() => setViewMode("list")}
        icon={<List />}
        size="sm"
      />
    </div>
  </div>
);

export default BrowseHeader;
