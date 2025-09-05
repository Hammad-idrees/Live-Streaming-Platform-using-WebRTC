import React from "react";
import { allStreams } from "../browse/browseData";
import StreamCard from "../../components/ui/StreamCard";

const Trending = () => {
  // Sort streams by viewers (descending) to get trending
  const trendingStreams = [...allStreams].sort((a, b) => b.viewers - a.viewers);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">Trending Streams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingStreams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
      </div>
    </div>
  );
};

export default Trending;
