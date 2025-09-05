const express = require("express");
const router = express.Router();
const vodController = require("../../../controllers/vod.controller");
const auth = require("../../../middleware/auth");
const { check, validationResult } = require("express-validator");

// GET routes for listing and retrieving VODs
router.get("/", vodController.listVods);

// Authenticated routes for saved, liked, and recently-watched
router.get("/saved", auth, vodController.getSavedVods);
router.get("/liked", auth, vodController.getLikedVods);
router.post("/recently-watched/:id", auth, vodController.addRecentlyWatched);
router.get("/recently-watched", auth, vodController.getRecentlyWatched);

// Search and single-item GET
router.get("/search", vodController.searchVods);
router.get("/:vodId", vodController.getVod);

// Create a new VOD
router.post("/", auth, vodController.createVod);

// Like a VOD (requires auth)
router.post(
  "/like/:id",
  auth, // ← ensure req.user is set
  check("id").isMongoId().withMessage("Invalid VOD ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  vodController.likeVod
);

// Dislike a VOD (requires auth)
router.post(
  "/dislike/:id",
  auth, // ← ensure req.user is set
  check("id").isMongoId().withMessage("Invalid VOD ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, data: null, error: errors.array() });
    }
    next();
  },
  vodController.dislikeVod
);

router.get("/interactions/:vodId", auth, vodController.getVodInteractions);

// Save / Unsave a VOD
router.post("/save/:id", auth, vodController.saveVod);
router.post("/unsave/:id", auth, vodController.unsaveVod);

router.post("/like/:id", auth, vodController.toggleLike);
router.post("/dislike/:id", auth, vodController.toggleDislike);
module.exports = router;
