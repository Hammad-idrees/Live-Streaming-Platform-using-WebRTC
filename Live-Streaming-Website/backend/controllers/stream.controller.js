const streamService = require("../services/stream/ingest.service");
const Stream = require("../models/Stream");
const categories = require("../constants/categories");
const pusher = require("../utils/pusher");

// Stream start/stop is now managed by the WebRTC signaling server
exports.startStream = async (req, res) => {
  try {
    const { streamKey, title, description, category } = req.body;
    if (!streamKey || !title || !category || !categories.includes(category)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Missing or invalid streamKey, title, or category",
      });
    }
    const userId = req.user._id;
    const stream = await streamService.startStream(
      userId,
      streamKey,
      title,
      description,
      category
    );
    // Stream start notification
    pusher.trigger(`user-${userId}`, "notification", {
      type: "stream-start",
      message: `Your stream is now live!`,
      data: { streamId: stream._id },
    });
    res.status(201).json({ success: true, data: stream, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.stopStream = async (req, res) => {
  try {
    const { streamKey } = req.body;
    if (!streamKey) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Missing streamKey",
      });
    }
    const stream = await streamService.stopStream(streamKey);
    // Stream end notification
    pusher.trigger(`user-${stream.user}`, "notification", {
      type: "stream-end",
      message: `Your stream has ended.`,
      data: { streamId: stream._id },
    });
    res.json({ success: true, data: stream, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getStreamInfo = async (req, res) => {
  try {
    const { streamKey } = req.params;
    const stream = await Stream.findOne({ streamKey });
    if (!stream)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Stream not found" });
    if (stream.ageRestricted && req.user && req.user.age < 18) {
      return res.status(403).json({
        success: false,
        data: null,
        error: "You must be 18+ to view this stream.",
      });
    }
    res.json({ success: true, data: stream, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getStreamStats = async (req, res) => {
  // In production, gather real stats from FFmpeg or player feedback
  res.json({
    success: true,
    data: {
      bitrate: 2500, // kbps
      resolution: "1280x720",
      bufferHealth: "good",
      viewers: 42, // Example
    },
    error: null,
  });
};

// Like a stream
exports.likeStream = async (req, res) => {
  try {
    const result = await streamService.toggleLike(req.params.id, req.user._id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, data: null, error: "Stream not found" });
    }
    const stream = await Stream.findById(req.params.id);
    if (stream && stream.user && String(stream.user) !== String(req.user._id)) {
      pusher.trigger(`user-${stream.user}`, "notification", {
        type: "like",
        message: `${req.user.username} liked your stream.`,
        data: { streamId: stream._id },
      });
    }
    res.json({ success: true, data: result, error: null });
  } catch (err) {
    res
      .status(err.message === "Stream not found" ? 404 : 500)
      .json({ success: false, data: null, error: err.message });
  }
};

// Dislike a stream
exports.dislikeStream = async (req, res) => {
  try {
    const result = await streamService.toggleDislike(
      req.params.id,
      req.user._id
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, data: null, error: "Stream not found" });
    }
    const stream = await Stream.findById(req.params.id);
    if (stream && stream.user && String(stream.user) !== String(req.user._id)) {
      // sendNotificationToUser(io, stream.user, {
      //   type: "dislike",
      //   message: `${req.user.username} disliked your stream.`,
      //   data: { streamId: stream._id },
      // });
    }
    res.json({ success: true, data: result, error: null });
  } catch (err) {
    res
      .status(err.message === "Stream not found" ? 404 : 500)
      .json({ success: false, data: null, error: err.message });
  }
};

exports.getLiveStreams = async (req, res) => {
  try {
    const filter = { isLive: true, status: "live" };
    if (req.query.category && categories.includes(req.query.category)) {
      filter.category = req.query.category;
    }
    const streams = await Stream.find(filter).populate(Stream.userPopulation());
    res.json({ success: true, data: streams, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all liked streams for the current user
exports.getLikedStreams = async (req, res) => {
  try {
    const Stream = require("../models/Stream");
    const streams = await Stream.find({ likes: req.user._id }).populate(
      Stream.userPopulation()
    );
    res.json({ success: true, data: streams, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
