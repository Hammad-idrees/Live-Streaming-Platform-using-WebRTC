// models/Vod.js

const mongoose = require("mongoose");
const categories = require("../constants/categories"); // If you use enums

const vodSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: categories || undefined, // Optional enum
      default: "uncategorized",
      index: true,
    },

    // ✅ AI Tags for Search
    aiTags: {
      type: [String],
      default: [],
      index: true,
    },

    // ✅ AI Analysis Structured
    aiAnalysis: {
      objects: [
        {
          name: { type: String },
          confidence: { type: Number },
          timestamps: [Number], // e.g. frame indices or seconds
        },
      ],
      tagCounts: {
        type: Map,
        of: Number,
        default: new Map(),
      },
      frameAnalysis: [
        {
          frameIndex: Number,
          detectedObjects: [String],
          confidence: { type: Number, default: 1.0 },
          timestamp: String,
        },
      ],
      sceneType: String,
      dominantColors: [String],
      isSensitive: {
        type: Boolean,
        default: false,
      },
      totalObjectsDetected: { type: Number, default: 0 },
      framesAnalyzed: { type: Number, default: 0 },
      processingDate: { type: Date, default: Date.now },
    },

    resolutions: {
      type: [String],
      default: ["480p", "720p", "1080p"],
    },

    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "uploaded"],
      default: "uploaded",
    },

    hlsPath: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔍 Full-text search index
vodSchema.index({
  title: "text",
  description: "text",
  aiTags: "text",
  category: "text",
});

// 📷 Virtuals (like thumbnail fallback)
vodSchema.virtual("thumbnailUrl").get(function () {
  return this.thumbnail
    ? `/uploads/thumbnails/${this.thumbnail}`
    : "/default-thumbnail.jpg";
});

// 🧠 Static methods for reusable queries
vodSchema.statics = {
  userPopulation() {
    return { path: "user", select: "username avatar" };
  },
  findByObjects(objects) {
    return this.find({
      aiTags: { $in: objects.map((o) => o.toLowerCase()) },
    });
  },
};

module.exports = mongoose.models.Vod || mongoose.model("Vod", vodSchema);
