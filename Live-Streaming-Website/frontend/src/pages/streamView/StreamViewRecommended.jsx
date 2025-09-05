import React from "react";
import StreamCard from "../../components/ui/StreamCard";

const StreamViewRecommended = ({
  recommendedStreams,
  handleRecommendedClick,
}) => (
  <div className="mt-12">
    <h2 className="text-xl font-bold text-white mb-4">Recommended Streams</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendedStreams.map((stream) => (
        <StreamCard
          key={stream.id}
          stream={stream}
          onClick={() => handleRecommendedClick(stream.id)}
        />
      ))}
    </div>
  </div>
);

export default StreamViewRecommended;
