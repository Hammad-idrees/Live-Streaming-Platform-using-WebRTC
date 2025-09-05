import React from "react";
import useStreamView from "./useStreamView";
import StreamViewHeader from "./StreamViewHeader";
import StreamerInfo from "./StreamerInfo";
import StreamViewVideo from "./StreamViewVideo";
import StreamViewChat from "./StreamViewChat";
import StreamViewRecommended from "./StreamViewRecommended";
import StreamViewShareModal from "./StreamViewShareModal";

const StreamView = () => {
  const {
    streamData,
    recommendedStreams,
    isFollowing,
    isSubscribed,
    showShareModal,
    chatCollapsed,
    formatUptime,
    formatNumber,
    handleFollow,
    handleSubscribe,
    handleShare,
    handleCloseShareModal,
    handleCollapseChat,
    handleRecommendedClick,
  } = useStreamView();

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="flex">
        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${
            chatCollapsed ? "mr-0" : "mr-80"
          }`}
        >
          <StreamViewVideo streamData={streamData} />
          <div className="p-6 space-y-6">
            <StreamViewHeader
              streamData={streamData}
              isFollowing={isFollowing}
              handleFollow={handleFollow}
              handleShare={handleShare}
              formatNumber={formatNumber}
            />
            <div className="flex items-center justify-between bg-dark-800/50 rounded-xl p-4">
              <StreamerInfo
                streamData={streamData}
                formatNumber={formatNumber}
              />
              <div className="flex items-center gap-2">
                {/* Subscription, Gift, More actions can be added here */}
              </div>
            </div>
            {/* Stream description, tags, etc. can be added here */}
            <StreamViewRecommended
              recommendedStreams={recommendedStreams}
              handleRecommendedClick={handleRecommendedClick}
            />
          </div>
        </div>
        <StreamViewChat
          streamData={streamData}
          chatCollapsed={chatCollapsed}
          setChatCollapsed={handleCollapseChat}
        />
      </div>
      <StreamViewShareModal
        showShareModal={showShareModal}
        handleCloseShareModal={handleCloseShareModal}
        streamData={streamData}
      />
    </div>
  );
};

export default StreamView;
