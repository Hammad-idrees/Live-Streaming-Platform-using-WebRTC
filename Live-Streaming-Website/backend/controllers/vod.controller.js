const Vod = require("../models/Vod");
const embeddingService = require("../services/embedding.service");
const User = require("../models/User");
const categories = require("../constants/categories");
const io = require("../server").io; // Make sure io is exported from server.js
const { analyzeImage } = require("../services/pythonService");

exports.listVods = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && categories.includes(req.query.category)) {
      filter.category = req.query.category;
    }
    const vods = await Vod.find(filter).populate(Vod.userPopulation());
    res.json({ success: true, data: vods, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getVod = async (req, res) => {
  try {
    const { vodId } = req.params;
    const vod = await Vod.findById(vodId)
      .populate("user", "username avatar")
      .populate("stream", "title");
    if (!vod) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "VOD not found",
      });
    }
    res.json({ success: true, data: vod, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Like a VOD
exports.likeVod = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.error("likeVod: req.user or req.user._id is missing", req.user);
      return res.status(401).json({
        success: false,
        data: null,
        error: "Unauthorized: user not found in request",
      });
    }

    const vodId = req.params.id;
    const userId = req.user._id;

    // Find the VOD first to check existence
    const vod = await Vod.findById(vodId);
    if (!vod) {
      console.error("likeVod: VOD not found for id", vodId);
      return res.status(404).json({
        success: false,
        data: null,
        error: "VOD not found",
      });
    }

    // Check if already liked
    const alreadyLiked = vod.likes.includes(userId);

    let result;
    if (alreadyLiked) {
      // Unlike the VOD
      result = await Vod.findByIdAndUpdate(
        vodId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // Like the VOD and remove dislike if exists
      result = await Vod.findByIdAndUpdate(
        vodId,
        {
          $addToSet: { likes: userId },
          $pull: { dislikes: userId },
        },
        { new: true }
      );
    }

    if (!result) {
      console.error("likeVod: Update operation failed for id", vodId);
      return res.status(500).json({
        success: false,
        data: null,
        error: "Failed to update VOD",
      });
    }

    // Return the updated counts
    res.json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likeCount: result.likes.length,
        dislikeCount: result.dislikes.length,
      },
      error: null,
    });
  } catch (err) {
    console.error("likeVod error for id", req.params.id, err);
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};

// Dislike a VOD
exports.dislikeVod = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.error(
        "dislikeVod: req.user or req.user._id is missing",
        req.user
      );
      return res.status(401).json({
        success: false,
        data: null,
        error: "Unauthorized: user not found in request",
      });
    }
    const result =
      await require("../services/stream/ingest.service").toggleVodDislike(
        req.params.id,
        req.user._id
      );
    console.log("dislikeVod: result for id", req.params.id, "is", result);
    if (!result || typeof result !== "object" || !("_id" in result)) {
      console.error(
        "dislikeVod: result is missing or missing _id for id",
        req.params.id,
        "result:",
        result
      );
      return res
        .status(404)
        .json({ success: false, data: null, error: "VOD not found" });
    }
    res.json({ success: true, data: result, error: null });
  } catch (err) {
    console.error("dislikeVod error for id", req.params.id, err);
    res
      .status(err.message === "VOD not found" ? 404 : 500)
      .json({ success: false, data: null, error: err.message });
  }
};

exports.createVod = async (req, res) => {
  try {
    const { title, description, url, user, stream, category } = req.body;

    // Validate category
    if (!category || !categories.includes(category)) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Invalid or missing category",
      });
    }

    let vodData = {
      title,
      description: description || "",
      url,
      category,
    };

    // If creating VOD from stream (automatic flow)
    if (stream) {
      // Validate that the stream exists and belongs to the user
      const Stream = require("../models/Stream");
      const streamDoc = await Stream.findById(stream);
      if (!streamDoc) {
        return res.status(404).json({
          success: false,
          data: null,
          error: "Stream not found",
        });
      }

      // Auto-fill user from stream
      vodData.user = streamDoc.user;
      vodData.stream = stream;

      // Auto-fill title and description from stream if not provided
      if (!title) vodData.title = streamDoc.title;
      if (!description) vodData.description = streamDoc.description || "";
    } else {
      // Manual creation (for testing)
      if (!user) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "User ID is required when not creating from stream",
        });
      }
      vodData.user = user;
    }

    // Generate embedding for search
    const vector = await embeddingService.getEmbedding(
      `${vodData.title} ${vodData.description}`
    );
    vodData.vector = vector;

    const vod = await Vod.create(vodData);
    res.status(201).json({ success: true, data: vod, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Improved searchVods function with better error handling
exports.searchVods = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
      });
    }

    // Build the search query safely with schema validation
    const searchQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { aiTags: { $regex: q, $options: "i" } },
      ],
    };

    // ✅ Safe AI analysis queries with proper error handling
    try {
      // Check if aiAnalysis field exists and has the expected structure
      const sampleDoc = await Vod.findOne({
        "aiAnalysis.objects.0.name": { $exists: true },
      });

      if (sampleDoc) {
        // Search in object names (not the objects themselves)
        searchQuery.$or.push({
          "aiAnalysis.objects.name": { $regex: q, $options: "i" },
        });
      }

      // Check for frame analysis
      const frameDoc = await Vod.findOne({
        "aiAnalysis.frameAnalysis.0.detectedObjects": { $exists: true },
      });

      if (frameDoc) {
        searchQuery.$or.push({
          "aiAnalysis.frameAnalysis.detectedObjects": {
            $regex: q,
            $options: "i",
          },
        });
      }
    } catch (schemaError) {
      console.warn(
        "⚠️ AI analysis fields not searchable:",
        schemaError.message
      );
      // Continue without AI analysis search
    }

    // ✅ Execute search with proper error handling
    const vods = await Vod.find(searchQuery)
      .populate("user", "username avatar") // More explicit population
      .select("-__v") // Exclude version field
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(100) // Limit results for performance
      .lean()
      .exec();

    // ✅ Transform results to ensure consistent structure
    const transformedVods = vods.map((vod) => ({
      ...vod,
      // Ensure aiAnalysis.objects is always an array of objects
      aiAnalysis: vod.aiAnalysis
        ? {
            ...vod.aiAnalysis,
            objects: Array.isArray(vod.aiAnalysis.objects)
              ? vod.aiAnalysis.objects.filter(
                  (obj) => obj && typeof obj === "object"
                )
              : [],
          }
        : undefined,
    }));

    res.json({
      success: true,
      data: transformedVods,
      count: transformedVods.length,
      query: q,
    });
  } catch (err) {
    console.error("🔍 Search error:", err);

    // Handle specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid search parameters",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }

    res.status(500).json({
      success: false,
      error: "Search temporarily unavailable",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ✅ Additional utility function for safe AI object queries
exports.searchByAiObjects = async (req, res) => {
  try {
    const { objects } = req.query; // Expecting comma-separated objects

    if (!objects) {
      return res.status(400).json({
        success: false,
        error: "Objects parameter is required",
      });
    }

    const objectList = objects
      .split(",")
      .map((obj) => obj.trim().toLowerCase());

    const vods = await Vod.find({
      $or: [
        { "aiAnalysis.objects.name": { $in: objectList } },
        { aiTags: { $in: objectList } },
      ],
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      data: vods,
      searchedObjects: objectList,
    });
  } catch (error) {
    console.error("🎯 AI object search error:", error);
    res.status(500).json({
      success: false,
      error: "AI object search failed",
    });
  }
};

// Save a VOD
exports.saveVod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    if (!user.savedVods.includes(req.params.id)) {
      user.savedVods.push(req.params.id);
      await user.save();
    }
    res.json({ success: true, data: { message: "VOD saved" }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Unsave a VOD
exports.unsaveVod = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    user.savedVods = user.savedVods.filter(
      (vodId) => vodId.toString() !== req.params.id
    );
    await user.save();
    res.json({ success: true, data: { message: "VOD unsaved" }, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all saved VODs for the current user
exports.getSavedVods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedVods",
      populate: require("../models/Vod").userPopulation(),
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    res.json({ success: true, data: user.savedVods, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all liked VODs for the current user
exports.getLikedVods = async (req, res) => {
  try {
    const Vod = require("../models/Vod");
    const vods = await Vod.find({ likes: req.user._id }).populate(
      Vod.userPopulation()
    );
    res.json({ success: true, data: vods, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Add or update a recently watched VOD
exports.addRecentlyWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const vodId = req.params.id;
    // Remove if already exists
    user.recentlyWatched = user.recentlyWatched.filter(
      (entry) => entry.vod.toString() !== vodId
    );
    // Add to front
    user.recentlyWatched.unshift({ vod: vodId, watchedAt: new Date() });
    // Limit to 20
    user.recentlyWatched = user.recentlyWatched.slice(0, 20);
    await user.save();
    res.json({
      success: true,
      data: { message: "VOD added to recently watched" },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get all recently watched VODs for the current user
exports.getRecentlyWatched = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "recentlyWatched.vod",
      populate: require("../models/Vod").userPopulation(),
    });
    res.json({ success: true, data: user.recentlyWatched, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
// for checking interaction
// Get like/dislike status for a VOD
exports.getVodInteractions = async (req, res) => {
  try {
    const vodId = req.params.vodId;
    const userId = req.user._id;

    // Find the VOD
    const vod = await Vod.findById(vodId);
    if (!vod) {
      return res.status(404).json({
        success: false,
        data: null,
        error: "VOD not found",
      });
    }

    // Check if user has liked/disliked this VOD
    const liked = vod.likes.includes(userId);
    const disliked = vod.dislikes.includes(userId);

    res.json({
      success: true,
      data: {
        liked,
        disliked,
        likeCount: vod.likes.length,
        dislikeCount: vod.dislikes.length,
      },
      error: null,
    });
  } catch (err) {
    console.error("Error getting VOD interactions:", err);
    res.status(500).json({
      success: false,
      data: null,
      error: err.message,
    });
  }
};
// unlike undislike the video
// Like/Unlike a VOD
exports.toggleLike = async (req, res) => {
  try {
    const vodId = req.params.id;
    const userId = req.user._id;

    const vod = await Vod.findById(vodId);
    if (!vod) {
      return res.status(404).json({
        success: false,
        error: "VOD not found",
      });
    }

    const isLiked = vod.likes.includes(userId);
    const isDisliked = vod.dislikes.includes(userId);

    let update = {};
    if (isLiked) {
      update = { $pull: { likes: userId } };
    } else {
      update = {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      };
    }

    const updatedVod = await Vod.findByIdAndUpdate(vodId, update, {
      new: true,
    });

    res.json({
      success: true,
      data: {
        liked: !isLiked,
        disliked: false,
        likeCount: updatedVod.likes.length,
        dislikeCount: updatedVod.dislikes.length,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// Dislike/Undislike a VOD
exports.toggleDislike = async (req, res) => {
  try {
    const vodId = req.params.id;
    const userId = req.user._id;

    const vod = await Vod.findById(vodId);
    if (!vod) {
      return res.status(404).json({
        success: false,
        error: "VOD not found",
      });
    }

    const isDisliked = vod.dislikes.includes(userId);
    const isLiked = vod.likes.includes(userId);

    let update = {};
    if (isDisliked) {
      update = { $pull: { dislikes: userId } };
    } else {
      update = {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      };
    }

    const updatedVod = await Vod.findByIdAndUpdate(vodId, update, {
      new: true,
    });

    res.json({
      success: true,
      data: {
        disliked: !isDisliked,
        liked: false,
        likeCount: updatedVod.likes.length,
        dislikeCount: updatedVod.dislikes.length,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
