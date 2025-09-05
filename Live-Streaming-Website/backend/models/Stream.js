const mongoose = require("mongoose");
const categories = require("../constants/categories");

const streamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["live", "offline", "ended"],
      default: "offline",
    },
    streamKey: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    viewers: {
      type: Number,
      default: 0,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    producerId: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    bannedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ageRestricted: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: String, enum: categories, required: true },
  },
  { timestamps: true }
);

// Static for user population
streamSchema.statics.userPopulation = function () {
  return { path: "user", select: "username avatar" };
};

module.exports = mongoose.model("Stream", streamSchema);
