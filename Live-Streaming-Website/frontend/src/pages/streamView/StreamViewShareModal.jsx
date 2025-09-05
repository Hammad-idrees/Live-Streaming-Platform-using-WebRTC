import React from "react";
import { X, Link as LinkIcon } from "lucide-react";

const StreamViewShareModal = ({
  showShareModal,
  handleCloseShareModal,
  streamData,
}) => {
  if (!showShareModal) return null;
  const streamUrl = window.location.href;
  const handleCopy = () => {
    navigator.clipboard.writeText(streamUrl);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-dark-900 rounded-xl p-8 w-full max-w-md relative border border-dark-700">
        <button
          onClick={handleCloseShareModal}
          className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Share Stream</h2>
        <div className="mb-4">
          <input
            type="text"
            value={streamUrl}
            readOnly
            className="w-full bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white mb-2"
          />
          <button
            onClick={handleCopy}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <LinkIcon size={16} /> Copy Link
          </button>
        </div>
        {/* Social sharing buttons can be added here */}
        <div className="flex gap-3 mt-4">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              streamUrl
            )}&text=Check out this stream: ${streamData.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Share on Twitter
          </a>
          {/* Add more social buttons as needed */}
        </div>
      </div>
    </div>
  );
};

export default StreamViewShareModal;
