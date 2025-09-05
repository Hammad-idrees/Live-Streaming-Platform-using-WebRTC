import React from "react";
import StreamCard from "../../components/ui/StreamCard";
import Button from "../../components/ui/Button";

const LiveStreamsList = ({ liveStreams, onViewChange, handleStreamClick }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">Live Now</h2>
      <Button variant="ghost" onClick={() => onViewChange("browse")}>
        View All
      </Button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {liveStreams.slice(0, 8).map((stream) => (
        <StreamCard
          key={stream.id}
          stream={stream}
          onClick={() => handleStreamClick(stream.id)}
        />
      ))}
    </div>
  </div>
);

export default LiveStreamsList;
