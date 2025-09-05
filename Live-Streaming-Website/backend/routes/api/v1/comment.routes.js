const express = require("express");
const router = express.Router();
const commentController = require("../../../controllers/comment.controller");
const auth = require("../../../middleware/auth");

// Add new comment (authenticated)
router.post("/", auth, commentController.addComment);

// Get comments for a VOD (public)
router.get("/:vodId", commentController.getComments);

// Delete a comment by ID
router.delete("/:commentId", auth, commentController.deleteComment);

module.exports = router;
