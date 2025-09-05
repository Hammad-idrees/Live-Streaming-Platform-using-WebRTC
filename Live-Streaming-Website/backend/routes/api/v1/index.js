const express = require("express");
const router = express.Router();
const commentRoutes = require("./comment.routes");
const uploadRoutes = require("./upload.routes"); // <-- Add this line

router.use("/stream", require("./stream.routes"));
router.use("/viewer", require("./viewer.routes"));
router.use("/chat", require("./chat.routes"));
router.use("/user", require("./user.routes"));
router.use("/admin", require("./admin.routes"));
router.use("/report", require("./report.routes"));
router.use("/analytics", require("./analytics.routes"));
router.use("/playlist", require("./playlist.routes"));
router.use("/follow", require("./follow.routes"));
router.use("/search", require("./search.routes"));
router.use("/vod", require("./vod.routes")); // videos routes
router.use("/upload", uploadRoutes); // <-- Add this line

router.use("/constants", require("./constants.routes"));
router.use("/comment", commentRoutes);
// Expose ICE server config to clients
//router.use("/turn", require("./turn"));

module.exports = router;
