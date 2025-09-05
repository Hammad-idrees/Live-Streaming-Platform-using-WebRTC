const express = require("express");
const router = express.Router();
const streamController = require("../../../controllers/stream.controller");
const auth = require("../../../middleware/auth");
const roleCheck = require("../../../middleware/roleCheck");
const { check, validationResult } = require("express-validator");

router.use(auth);

// Enable stream creation and stopping for test purposes
router.post("/start", roleCheck("streamer"), streamController.startStream);
router.post("/stop", roleCheck("streamer"), streamController.stopStream);

router.get("/live", streamController.getLiveStreams);
router.get("/liked", auth, streamController.getLikedStreams);
router.get("/:streamKey", streamController.getStreamInfo);
router.post(
  "/like/:id",
  check("id").isMongoId().withMessage("Invalid stream ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  streamController.likeStream
);

router.post(
  "/dislike/:id",
  check("id").isMongoId().withMessage("Invalid stream ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  streamController.dislikeStream
);

module.exports = router;
