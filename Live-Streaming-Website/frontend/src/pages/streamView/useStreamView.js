import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  streamData as mockStreamData,
  recommendedStreams,
} from "./streamViewData";

export default function useStreamView() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);

  // In real app, fetch streamData from backend using streamId
  const streamData = { ...mockStreamData, id: streamId };

  const formatUptime = (startTime) => {
    const now = new Date();
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const handleFollow = () => setIsFollowing((prev) => !prev);
  const handleSubscribe = () => setIsSubscribed((prev) => !prev);
  const handleShare = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);
  const handleCollapseChat = () => setChatCollapsed((prev) => !prev);
  const handleRecommendedClick = (id) => navigate(`/stream/${id}`);

  return {
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
  };
}
