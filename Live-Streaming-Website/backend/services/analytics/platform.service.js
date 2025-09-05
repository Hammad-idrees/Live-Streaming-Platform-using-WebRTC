// platform.service.js
const Stream = require("../../models/Stream");
const Vod = require("../../models/Vod");
const User = require("../../models/User");
const Chat = require("../../models/Chat");

async function getPlatformStats() {
  // Peak viewer count (all-time)
  const peakStream = await Stream.findOne().sort({ viewers: -1 });
  const peakViewers = peakStream ? peakStream.viewers : 0;
  // Most-watched streams (by viewers)
  const mostWatched = await Stream.find()
    .sort({ viewers: -1 })
    .limit(5)
    .select("title viewers user");
  // Average watch time (dummy, as we don't track per-user watch time)
  // Could be improved if you track join/leave events
  const avgWatchTime = 0;
  // Total chat messages
  const totalMessages = await Chat.countDocuments();
  // New users per day (last 7 days)
  const usersPerDay = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  // New streams per day (last 7 days)
  const streamsPerDay = await Stream.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return {
    peakViewers,
    mostWatched,
    avgWatchTime,
    totalMessages,
    usersPerDay,
    streamsPerDay,
  };
}

module.exports = { getPlatformStats };
