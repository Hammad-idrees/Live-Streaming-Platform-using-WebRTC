const Stream = require("../../models/Stream");
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const pushService = require("../notification/push.service");
const archiveService = require("./archive.service");

// Stream start/stop is now managed by the WebRTC signaling server
async function startStream(userId, streamKey, title, description, category) {
  // Placeholder: Validate RTMP connection, authenticate user, etc.
  const stream = await Stream.create({
    user: userId,
    streamKey,
    title,
    description,
    category,
    status: "live",
    isLive: true,
    startedAt: new Date(),
  });

  // Notify all viewers (users with role 'user')
  const viewers = await User.find({ role: "user" });
  for (const viewer of viewers) {
    await Notification.create({
      user: viewer._id,
      type: "stream",
      message: `A new stream has started: ${title}`,
    });
    await pushService.sendPushNotification(
      viewer._id,
      "New Stream Started!",
      `A new stream has started: ${title}`
    );
  }

  return stream;
}

async function stopStream(streamKey) {
  // Placeholder: End the stream, update status
  const stream = await Stream.findOneAndUpdate(
    { streamKey, status: "live" },
    { status: "ended", isLive: false, endedAt: new Date() },
    { new: true }
  );

  if (stream) {
    // Automatically archive stream as VOD
    try {
      await archiveService.archiveStreamAsVod(stream._id);
      console.log(`Stream ${stream._id} stopped and archived as VOD`);
    } catch (error) {
      console.error("Failed to archive stream as VOD:", error);
    }
  }

  return stream;
}

// Toggle like for a stream
async function toggleLike(streamId, userId) {
  const stream = await Stream.findById(streamId);
  if (!stream) throw new Error("Stream not found");
  // Remove dislike if present
  stream.dislikes = stream.dislikes.filter(
    (id) => id.toString() !== userId.toString()
  );
  // Toggle like
  if (stream.likes.some((id) => id.toString() === userId.toString())) {
    stream.likes = stream.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    stream.likes.push(userId);
  }
  await stream.save();
  return { likes: stream.likes.length, dislikes: stream.dislikes.length };
}

// Toggle dislike for a stream
async function toggleDislike(streamId, userId) {
  const stream = await Stream.findById(streamId);
  if (!stream) throw new Error("Stream not found");
  // Remove like if present
  stream.likes = stream.likes.filter(
    (id) => id.toString() !== userId.toString()
  );
  // Toggle dislike
  if (stream.dislikes.some((id) => id.toString() === userId.toString())) {
    stream.dislikes = stream.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    stream.dislikes.push(userId);
  }
  await stream.save();
  return { likes: stream.likes.length, dislikes: stream.dislikes.length };
}

// Toggle like for a VOD
async function toggleVodLike(vodId, userId) {
  const Vod = require("../../models/Vod");
  const vod = await Vod.findById(vodId);
  if (!vod) return null;
  // Remove dislike if present
  vod.dislikes = vod.dislikes.filter(
    (id) => id.toString() !== userId.toString()
  );
  // Toggle like
  if (vod.likes.some((id) => id.toString() === userId.toString())) {
    vod.likes = vod.likes.filter((id) => id.toString() !== userId.toString());
  } else {
    vod.likes.push(userId);
  }
  await vod.save();
  return {
    likes: vod.likes.length,
    dislikes: vod.dislikes.length,
    _id: vod._id,
  };
}

// Toggle dislike for a VOD
async function toggleVodDislike(vodId, userId) {
  const Vod = require("../../models/Vod");
  const vod = await Vod.findById(vodId);
  if (!vod) return null;
  // Remove like if present
  vod.likes = vod.likes.filter((id) => id.toString() !== userId.toString());
  // Toggle dislike
  if (vod.dislikes.some((id) => id.toString() === userId.toString())) {
    vod.dislikes = vod.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  } else {
    vod.dislikes.push(userId);
  }
  await vod.save();
  return {
    likes: vod.likes.length,
    dislikes: vod.dislikes.length,
    _id: vod._id,
  };
}

module.exports = {
  startStream,
  stopStream,
  toggleLike,
  toggleDislike,
  toggleVodLike,
  toggleVodDislike,
};
