const Stream = require("../../models/Stream");
const Vod = require("../../models/Vod");
const embeddingService = require("../embedding.service");

// Archive a stream as VOD when it ends
async function archiveStreamAsVod(streamId, vodUrl) {
  try {
    const stream = await Stream.findById(streamId);
    if (!stream) {
      throw new Error("Stream not found");
    }

    // Generate VOD URL if not provided
    const finalVodUrl = vodUrl || `https://your-cdn.com/vods/${streamId}.mp4`;

    // Create VOD from stream data
    const vodData = {
      title: stream.title,
      description: stream.description || "",
      url: finalVodUrl,
      user: stream.user,
      stream: streamId,
      category: stream.category,
    };

    // Generate embedding for search
    const vector = await embeddingService.getEmbedding(
      `${vodData.title} ${vodData.description}`
    );
    vodData.vector = vector;

    const vod = await Vod.create(vodData);
    console.log(`Stream ${streamId} archived as VOD ${vod._id}`);

    return vod;
  } catch (error) {
    console.error("Error archiving stream as VOD:", error);
    throw error;
  }
}

// Get archived VODs for a user
async function getUserVods(userId) {
  try {
    const vods = await Vod.find({ user: userId })
      .populate("user", "username avatar")
      .populate("stream", "title")
      .sort({ createdAt: -1 });

    return vods;
  } catch (error) {
    console.error("Error getting user VODs:", error);
    throw error;
  }
}

module.exports = {
  archiveStreamAsVod,
  getUserVods,
};
