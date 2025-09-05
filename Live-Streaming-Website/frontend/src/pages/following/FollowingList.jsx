import React from "react";
import * as StreamCardModule from "../../components/ui/StreamCard";

const StreamCard = StreamCardModule.default;
const CompactStreamCard = StreamCardModule.CompactStreamCard;

const FollowingList = ({
  filteredStreamers,
  viewMode,
  handleStreamClick,
  handleProfileClick,
  toggleNotifications,
  handleUnfollow,
}) => (
  <div
    className={
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "flex flex-col gap-4"
    }
  >
    {filteredStreamers.length > 0 ? (
      filteredStreamers.map((streamer) =>
        viewMode === "grid" ? (
          <StreamCard
            key={streamer.id}
            stream={{
              ...streamer.stream,
              id: streamer.id,
              streamer: streamer.displayName,
              avatar: streamer.avatar,
            }}
            onClick={() => handleStreamClick(streamer.id)}
          />
        ) : (
          <CompactStreamCard
            key={streamer.id}
            streamer={streamer}
            onStreamClick={() => handleStreamClick(streamer.id)}
            onProfileClick={() => handleProfileClick(streamer.username)}
            onToggleNotifications={() => toggleNotifications(streamer.id)}
            onUnfollow={() => handleUnfollow(streamer.id)}
          />
        )
      )
    ) : (
      <div className="col-span-full text-center py-12">
        <div className="text-dark-400 text-lg mb-2">No streamers found</div>
        <p className="text-dark-500">Try adjusting your search or filters</p>
      </div>
    )}
  </div>
);

export default FollowingList;
