import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../../utils/api/playlist";
import VodCard from "../../components/ui/VodCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaTrash, FaListUl, FaChevronLeft } from "react-icons/fa";

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPlaylistById(id)
      .then((res) => {
        setPlaylist(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load playlist");
        setLoading(false);
        toast.error(err.message || "Failed to load playlist");
      });
  }, [id]);

  const handleRemove = async (vodId) => {
    try {
      await removeVideoFromPlaylist(id, vodId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== vodId),
      }));
      toast.success("Video removed from playlist");
    } catch (err) {
      setError(err.message || "Failed to remove video");
      toast.error(err.message || "Failed to remove video");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this playlist? This action cannot be undone."
      )
    )
      return;
    setDeleting(true);
    try {
      await deletePlaylist(id);
      toast.success("Playlist deleted successfully");
      setTimeout(() => navigate("/playlists"), 1200);
    } catch (err) {
      setError(err.message || "Failed to delete playlist");
      toast.error(err.message || "Failed to delete playlist");
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-red-500 bg-red-50 p-4 rounded-lg max-w-2xl mx-auto mt-4 flex items-center"
      >
        {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 max-w-5xl mx-auto"
    >
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            className="bg-dark-700 hover:bg-dark-600 text-gray-300 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
            onClick={() => navigate(-1)}
          >
            <FaChevronLeft /> Back
          </button>
          <FaListUl className="text-blue-500 text-2xl" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {playlist.name}
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
            {playlist.videos.length} video
            {playlist.videos.length !== 1 ? "s" : ""}
          </span>
        </div>
        <button
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md disabled:opacity-60"
          onClick={handleDelete}
          disabled={deleting}
        >
          <FaTrash /> {deleting ? "Deleting..." : "Delete Playlist"}
        </button>
      </div>
      {/* Videos Grid */}
      {playlist.videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 bg-dark-700 rounded-xl border-2 border-dashed border-dark-500 text-center"
        >
          <FaListUl className="text-dark-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-200 mb-1">
            No videos in this playlist
          </h3>
          <p className="text-gray-400 max-w-md">
            Add videos to this playlist to see them here.
          </p>
        </motion.div>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {playlist.videos.map((video, index) => (
            <motion.li
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative group"
            >
              <VodCard vod={video} size="default" showActions={false} />
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 hover:opacity-100 text-xs z-10"
                onClick={() => handleRemove(video._id)}
              >
                Remove
              </button>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default PlaylistDetails;
