import React, { useState, useRef, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoInfo from "./VideoInfo";
import axios from "axios";
import { getAuthToken } from "../../utils/api/config";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  vod,
  isPlaying,
  isFullscreen,
  onPlayPause,
  onFullscreenToggle,
  formatCount,
}) => {
  const [hovered, setHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportType, setReportType] = useState("vod");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const menuRef = useRef(null);
  const hoverTimeout = useRef(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/comments/${vod._id}`
        );
        if (response.data.success) {
          setComments(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [vod._id, showComments]);
  const handleVideoHover = (isEntering) => {
    if (isEntering) {
      hoverTimeout.current = setTimeout(() => {
        setHovered(true);
      }, 300);
    } else {
      clearTimeout(hoverTimeout.current);
      setHovered(false);
    }
  };

  // Save/Unsave functionality
  const saveVideo = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/vod/save/${vod._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) setIsSaved(true);
    } catch (err) {
      console.error("Error saving video:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const unsaveVideo = async () => {
    const token = getAuthToken();
    if (!token) return;

    setIsSaving(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/v1/vod/unsave/${vod._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) setIsSaved(false);
    } catch (err) {
      console.error("Error unsaving video:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Like/Dislike functionality
  const handleLike = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/vod/like/${vod._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setLiked(response.data.data.liked);
        setDisliked(response.data.data.disliked);
        // Update counts in parent component if needed
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      if (err.response?.status === 404) {
        alert("This video no longer exists");
      }
    }
  };

  const handleDislike = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/vod/dislike/${vod._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setDisliked(response.data.data.disliked);
        setLiked(response.data.data.liked);
        // Update counts in parent component if needed
      }
    } catch (err) {
      console.error("Error toggling dislike:", err);
      if (err.response?.status === 404) {
        alert("This video no longer exists");
      }
    }
  };
  const submitComment = async (commentText) => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/comment/`,
        {
          vodId: vod._id,
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentText("");
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert(
        "Failed to post comment: " +
          (err.response?.data?.error || "Server error")
      );
    }
  };
  // Report functionality
  const submitReport = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/report`,
        {
          targetType: reportType,
          targetId: vod._id,
          reason: reportReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setReportReason("");
        setIsReporting(false);
        alert("Report submitted successfully");
      }
    } catch (err) {
      console.error("Error submitting report:", err);
    }
  };

  // Menu actions
  const handleMenuAction = async (action) => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      switch (action) {
        case "Add to Playlist":
          const playlistRes = await axios.post(
            `${BASE_URL}/api/v1/playlist/add-video`,
            {
              playlistId: "687de4b287304987a5af5371",
              vodId: vod._id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (playlistRes.data.success) {
            alert("Added to playlist!");
          }
          break;

        case "Saved":
          if (isSaved) await unsaveVideo();
          else await saveVideo();
          break;

        case "Report":
          setIsReporting(true);
          break;

        case "Comment":
          setShowCommentInput(true);
          break;
      }
      setActiveMenu(null);
    } catch (err) {
      console.error(`Error handling ${action}:`, err);
    }
  };

  // Check initial states on mount
  useEffect(() => {
    const checkInitialStates = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        // Check if video is saved
        const savedRes = await axios.get(`${BASE_URL}/api/v1/vod/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (savedRes.data.success) {
          setIsSaved(savedRes.data.data.some((v) => v._id === vod._id));
        }

        // Check if video is liked/disliked
        const interactionsRes = await axios.get(
          `${BASE_URL}/api/v1/vod/interactions/${vod._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (interactionsRes.data.success) {
          setLiked(interactionsRes.data.data.liked);
          setDisliked(interactionsRes.data.data.disliked);
        }
      } catch (err) {
        console.error("Error checking initial states:", err);
      }
    };

    checkInitialStates();
  }, [vod._id]);

  return (
    <div
      className="group bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-visible relative"
      onMouseEnter={() => handleVideoHover(true)}
      onMouseLeave={() => handleVideoHover(false)}
    >
      <VideoPlayer
        vod={vod}
        isHovered={hovered || isPlaying}
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        onPlayPause={onPlayPause}
        onFullscreenToggle={onFullscreenToggle}
      />

      <VideoInfo
        vod={vod}
        liked={liked}
        disliked={disliked}
        isSaved={isSaved}
        isSaving={isSaving}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuRef={menuRef}
        handleLike={handleLike}
        handleDislike={handleDislike}
        handleMenuAction={handleMenuAction}
        formatCount={formatCount}
        onSave={saveVideo}
        onUnsave={unsaveVideo}
        commentText={commentText}
        setCommentText={setCommentText}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        submitComment={submitComment}
        isReporting={isReporting}
        setIsReporting={setIsReporting}
        reportReason={reportReason}
        setReportReason={setReportReason}
        reportType={reportType}
        setReportType={setReportType}
        submitReport={submitReport}
        comments={comments} // Array of comment objects
      />
    </div>
  );
};

export default VideoCard;
