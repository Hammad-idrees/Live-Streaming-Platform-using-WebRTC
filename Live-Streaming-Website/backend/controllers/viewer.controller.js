const Stream = require("../models/Stream");
const viewerService = require("../services/analytics/viewer.service");

exports.joinStream = async (req, res) => {
  try {
    const { streamId } = req.body;
    const userId = req.user._id;
    await viewerService.trackViewer(streamId, userId);
    res.json({
      success: true,
      data: { message: "Joined stream" },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.leaveStream = async (req, res) => {
  try {
    // Placeholder: Implement leave logic if needed
    res.json({ success: true, data: { message: "Left stream" }, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.listLiveStreams = async (req, res) => {
  try {
    const streams = await Stream.find({ status: "live" }).populate(
      Stream.userPopulation()
    );
    res.json({ success: true, data: streams, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Add or update a recently watched live stream
exports.addRecentlyWatchedStream = async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user._id);
    const streamId = req.params.id;
    user.recentlyWatchedStreams = user.recentlyWatchedStreams.filter(
      (entry) => entry.stream.toString() !== streamId
    );
    user.recentlyWatchedStreams.unshift({
      stream: streamId,
      watchedAt: new Date(),
    });
    user.recentlyWatchedStreams = user.recentlyWatchedStreams.slice(0, 20);
    await user.save();
    res.json({
      success: true,
      data: { message: "Stream added to recently watched" },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all recently watched live streams for the current user
exports.getRecentlyWatchedStreams = async (req, res) => {
  try {
    const user = await require("../models/User")
      .findById(req.user._id)
      .populate({
        path: "recentlyWatchedStreams.stream",
        populate: require("../models/Stream").userPopulation(),
      });
    res.json({ success: true, data: user.recentlyWatchedStreams, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
