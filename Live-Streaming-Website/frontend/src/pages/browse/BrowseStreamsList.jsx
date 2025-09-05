import React from "react";
import StreamCard from "../../components/liveStreamCard/LiveStreamCard";

const BrowseStreamsList = ({
  filteredStreams,
  viewMode,
  handleStreamClick,
}) => (
  <div
    className={
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "flex flex-col gap-4"
    }
  >
    {filteredStreams.map((stream) => (
      <StreamCard
        key={stream.id}
        stream={stream}
        onClick={() => handleStreamClick(stream.id)}
        viewMode={viewMode}
      />
    ))}
  </div>
);

export default BrowseStreamsList;
