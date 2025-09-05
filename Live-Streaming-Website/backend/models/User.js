const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin", "streamer"],
      default: "user",
    },
    age: {
      type: Number,
      required: false,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 200,
    },
    location: {
      type: String,
      default: "",
      maxlength: 100,
    },
    website: {
      type: String,
      default: "",
      maxlength: 200,
    },
    savedVods: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vod" }],
    recentlyWatched: [
      {
        vod: { type: mongoose.Schema.Types.ObjectId, ref: "Vod" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    recentlyWatchedStreams: [
      {
        stream: { type: mongoose.Schema.Types.ObjectId, ref: "Stream" },
        watchedAt: { type: Date, default: Date.now },
      },
    ],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Static for user population
userSchema.statics.userPopulation = function () {
  return { path: "user", select: "username avatar" };
};

module.exports = mongoose.model("User", userSchema);
