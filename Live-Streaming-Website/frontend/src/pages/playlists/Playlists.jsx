import React, { useState } from "react";
import { usePlaylists } from "./usePlaylists";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTimes,
  FaSearch,
  FaSort,
  FaListUl,
  FaFolderPlus,
} from "react-icons/fa";

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "created", label: "Created Date" },
  { value: "count", label: "Number of Videos" },
];

const placeholderThumb = "https://placehold.co/600x338/222/fff?text=Playlist";

const Playlists = () => {
  const { playlists, loading, error, handleCreate, setError } = usePlaylists();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  const onCreate = async () => {
    if (!newName.trim()) return;
    const success = await handleCreate(newName);
    if (success) {
      setShowCreate(false);
      setNewName("");
    }
  };

  // Filter and sort playlists
  const filtered = playlists
    .filter((pl) => pl.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "created")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sort === "count") return b.videos.length - a.videos.length;
      return 0;
    });

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
        <FaTimes className="mr-2" />
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <FaListUl className="text-blue-500 text-2xl" />
          <h1 className="text-2xl md:text-3xl font-bold text-whites">
            My Playlists
          </h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full ml-2">
            {playlists.length}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          onClick={() => setShowCreate((v) => !v)}
        >
          {showCreate ? (
            <>
              <FaTimes /> Cancel
            </>
          ) : (
            <>
              <FaPlus /> Create Playlist
            </>
          )}
        </motion.button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search playlists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all text-black"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2.5">
          <FaSort className="text-gray-500" />
          <label htmlFor="sort" className="text-sm text-gray-600 font-medium">
            Sort by:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-none bg-transparent text-gray-700 font-medium focus:ring-0 focus:outline-none cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                  <FaFolderPlus />
                </div>
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-black"
                  placeholder="Playlist name"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    setError(null);
                  }}
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                onClick={onCreate}
              >
                <FaPlus /> Create
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center"
        >
          <FaListUl className="text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-1">
            No playlists found
          </h3>
          <p className="text-gray-500 max-w-md">
            {search
              ? "No playlists match your search. Try a different term."
              : "You don't have any playlists yet. Create your first one!"}
          </p>
        </motion.div>
      ) : (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((pl, index) => {
            const thumb = pl.videos[0]?.thumbnail || placeholderThumb;
            return (
              <motion.li
                key={pl._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-dark-800 rounded-xl border border-dark-700 shadow-sm overflow-hidden transition-all hover:shadow-lg group cursor-pointer"
              >
                <Link to={`/playlists/${pl._id}`} className="block h-full">
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={thumb}
                      alt={pl.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = placeholderThumb;
                      }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Video Count Badge */}
                    <div className="absolute top-3 left-3 bg-blue-600/90 px-2 py-1 rounded-md text-white text-xs font-bold shadow-lg">
                      {pl.videos.length} video
                      {pl.videos.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {pl.name}
                    </h3>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      )}
    </motion.div>
  );
};

export default Playlists;
