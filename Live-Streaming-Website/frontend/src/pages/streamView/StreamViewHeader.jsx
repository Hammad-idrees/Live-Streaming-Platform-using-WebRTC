import React from "react";
import { Heart, Share2, Flag, Eye } from "lucide-react";
import Button from "../../components/ui/Button";

const StreamViewHeader = ({
  streamData,
  isFollowing,
  handleFollow,
  handleShare,
  formatNumber,
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex-1">
      <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
        {streamData.title}
      </h1>
      <div className="flex items-center gap-3 text-dark-400 text-sm">
        <span className="inline-block bg-primary-600/20 text-primary-300 px-3 py-1 rounded-full">
          {streamData.category}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={14} />
          {formatNumber(streamData.viewerCount)} viewers
        </span>
        {/* Uptime and mature flag can be added here if needed */}
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant={isFollowing ? "ghost" : "primary"}
        onClick={handleFollow}
        icon={<Heart />}
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <Button variant="ghost" onClick={handleShare} icon={<Share2 />}>
        Share
      </Button>
      <Button variant="ghost" icon={<Flag />}>
        Report
      </Button>
    </div>
  </div>
);

export default StreamViewHeader;
