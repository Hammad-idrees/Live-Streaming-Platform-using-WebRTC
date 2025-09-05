const User = require("../models/User");
const Stream = require("../models/Stream");
const Report = require("../models/Report");
const ffmpegConfig = require("../config/ffmpeg");

exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.listStreams = async (req, res) => {
  try {
    const streams = await Stream.find().populate(Stream.userPopulation());
    res.json({ success: true, data: streams, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.listReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("reporter", "username");
    res.json({ success: true, data: reports, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findByIdAndUpdate(
      reportId,
      { status: "resolved" },
      { new: true }
    );
    res.json({ success: true, data: report, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.promoteToStreamer = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "streamer" },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    res.json({
      success: true,
      data: { message: "User promoted to streamer", user },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.demoteToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "user" },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    res.json({
      success: true,
      data: { message: "Streamer demoted to user", user },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    res.json({
      success: true,
      data: { message: "User promoted to admin", user },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getTranscodingSettings = (req, res) => {
  res.json({
    success: true,
    data: ffmpegConfig.transcodingSettings,
    error: null,
  });
};

exports.updateTranscodingSettings = (req, res) => {
  if (req.user.role !== "admin")
    return res
      .status(403)
      .json({ success: false, data: null, error: "Forbidden" });
  ffmpegConfig.updateTranscodingSettings(req.body);
  res.json({
    success: true,
    data: {
      message: "Transcoding settings updated",
      settings: ffmpegConfig.transcodingSettings,
    },
    error: null,
  });
};
