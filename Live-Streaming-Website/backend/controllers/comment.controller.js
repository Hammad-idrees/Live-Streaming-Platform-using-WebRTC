const Comment = require("../models/Comment");
const Vod = require("../models/Vod");
const pusher = require("../utils/pusher");

// Add a comment to a VOD
exports.addComment = async (req, res) => {
  try {
    const { vodId, text } = req.body;
    const userId = req.user._id;

    // Validation
    if (!vodId || !text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Comment text and VOD ID are required",
      });
    }

    // Check if VOD exists
    const vodExists = await Vod.exists({ _id: vodId });
    if (!vodExists) {
      return res.status(404).json({
        success: false,
        error: "Video not found",
      });
    }

    // Create comment
    const comment = await Comment.create({
      text: text.trim(),
      author: userId,
      vod: vodId,
    });

    // Populate author info
    await comment.populate(Comment.authorPopulation());

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({
      success: false,
      error: "Failed to add comment",
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { vodId } = req.params;

    const comments = await Comment.find({ vod: vodId })
      .populate(Comment.authorPopulation())
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments,
    });
  } catch (err) {
    console.error("Error getting comments:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch comments",
    });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, data: null, error: "Comment not found" });
    }
    // Only the author or an admin can delete
    if (
      String(comment.author) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, data: null, error: "Forbidden" });
    }
    await comment.deleteOne();
    res.json({ success: true, data: null, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
