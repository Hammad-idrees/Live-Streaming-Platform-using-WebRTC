const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vod" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
