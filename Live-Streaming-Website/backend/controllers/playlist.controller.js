const Playlist = require("../models/Playlist");
const Vod = require("../models/Vod");
const pusher = require("../utils/pusher");

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = await Playlist.create({
      name,
      owner: req.user._id,
      videos: [],
    });
    res.status(201).json({ success: true, data: playlist, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Add a video to a playlist
exports.addVideo = async (req, res) => {
  try {
    const { playlistId, vodId } = req.body;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.user._id,
    });
    if (!playlist)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Playlist not found" });
    if (!playlist.videos.includes(vodId)) {
      playlist.videos.push(vodId);
      await playlist.save();
    }
    if (
      playlist &&
      playlist.owner &&
      String(playlist.owner) !== String(req.user._id)
    ) {
      pusher.trigger(`user-${playlist.owner}`, "notification", {
        type: "playlist-add",
        message: `${req.user.username} added a video to your playlist.`,
        data: { playlistId: playlist._id },
      });
    }
    res.json({ success: true, data: playlist, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Remove a video from a playlist
exports.removeVideo = async (req, res) => {
  try {
    const { playlistId, vodId } = req.body;
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.user._id,
    });
    if (!playlist)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Playlist not found" });
    playlist.videos = playlist.videos.filter((id) => id.toString() !== vodId);
    await playlist.save();
    res.json({ success: true, data: playlist, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all playlists for the current user
exports.getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id });
    res.json({ success: true, data: playlists, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get a playlist's details (with populated videos)
exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      owner: req.user._id,
    }).populate({ path: "videos", populate: Vod.userPopulation() });
    if (!playlist)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Playlist not found" });
    res.json({ success: true, data: playlist, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!playlist)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Playlist not found" });
    res.json({ success: true, data: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
