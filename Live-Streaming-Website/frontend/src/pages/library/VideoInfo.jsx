import React, { useState } from "react";
import {
  Eye,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
} from "lucide-react";

const VideoInfo = ({
  vod,
  liked,
  disliked,
  isSaved,
  activeMenu,
  setActiveMenu,
  menuRef,
  handleLike,
  handleDislike,
  handleMenuAction,
  formatCount,
  onSave,
  onUnsave,
  submitComment,
  comments = [],
}) => {
  const [commentText, setCommentText] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      submitComment(commentText);
      setCommentText("");
      setShowCommentInput(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    setShowCommentInput(false);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-b-lg">
      {/* User Info Section */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex gap-4 flex-1 min-w-0">
          {vod.user?.avatar && (
            <img
              src={vod.user.avatar}
              alt={vod.user?.username}
              className="w-12 h-12 rounded-full flex-shrink-0 border-2 border-transparent group-hover:border-blue-400 transition-colors"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  vod.user?.username || "U"
                )}&background=0D8ABC&color=fff&size=60`;
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-lg line-clamp-2 leading-tight mb-2">
              {vod.title || "Untitled Video"}
            </h2>
            <p className="text-gray-400 text-base mb-2">
              {vod.user?.username || "Unknown"}
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <Eye size={16} className="mr-2" />
              <span>{formatCount(vod.viewCount)} views</span>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <div
          className="relative flex-shrink-0"
          ref={(el) => (menuRef.current = el)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === "main" ? null : "main");
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
          >
            <MoreVertical size={18} />
          </button>

          {activeMenu === "main" && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-600 rounded-lg shadow-2xl overflow-hidden z-50">
              {["Add to Playlist", isSaved ? "Unsave" : "Save", "Report"].map(
                (item, idx) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (item === "Save") {
                        onSave();
                      } else if (item === "Unsave") {
                        onUnsave();
                      } else {
                        handleMenuAction(item);
                      }
                    }}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      item === "Report"
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-white hover:bg-gray-700"
                    } ${idx > 0 ? "border-t border-gray-700" : ""}`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Like/Dislike */}
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                liked
                  ? "text-blue-400 bg-blue-400/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
              <span>{formatCount(vod.likes?.length || 0)}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDislike();
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                disliked
                  ? "text-red-400 bg-red-400/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <ThumbsDown size={16} fill={disliked ? "currentColor" : "none"} />
              <span>{formatCount(vod.dislikes?.length || 0)}</span>
            </button>
          </div>

          {/* Comments Button */}
          <button
            onClick={toggleComments}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showComments
                ? "text-white bg-gray-700"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            <MessageCircle size={16} />
            <span>{formatCount(comments.length)}</span>
          </button>
        </div>

        {/* Category & Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {vod.category && (
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-sm font-medium">
              {vod.category}
            </span>
          )}
          {vod.tags?.slice(0, 1).map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comment Input Field */}
      {showCommentInput && (
        <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      )}

      {/* Comments Display Section */}
      {showComments && (
        <div className="mt-4 space-y-4 max-h-60 overflow-y-auto">
          {/* Add Comment Button */}
          {!showCommentInput && (
            <button
              onClick={() => setShowCommentInput(true)}
              className="w-full text-left text-blue-400 hover:text-blue-300 text-sm mb-2"
            >
              Add a comment...
            </button>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.author?.avatar}
                    alt={comment.author?.username}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        comment.author?.username || "U"
                      )}&background=0D8ABC&color=fff&size=80`;
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {comment.author?.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : !showCommentInput ? (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-2">No comments yet</p>
              <button
                onClick={() => setShowCommentInput(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Be the first to comment
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default VideoInfo;