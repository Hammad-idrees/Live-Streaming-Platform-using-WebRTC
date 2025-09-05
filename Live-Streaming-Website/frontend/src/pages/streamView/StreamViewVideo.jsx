import React from "react";
import VideoPlayer from "../../components/videoPlayer/VideoPlayer";

const StreamViewVideo = ({ streamData }) => (
  <div className="relative">
    <VideoPlayer
      streamUrl={streamData.streamUrl}
      thumbnail={streamData.thumbnail}
      isLive={streamData.isLive}
      streamTitle={streamData.title}
      streamerName={streamData.streamer.displayName}
      viewerCount={streamData.viewerCount}
    />
  </div>
);

export default StreamViewVideo;
