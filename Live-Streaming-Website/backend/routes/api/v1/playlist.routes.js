const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const playlistController = require("../../../controllers/playlist.controller");

router.use(auth);

router.post("/create", playlistController.createPlaylist);
router.post("/add-video", playlistController.addVideo);
router.post("/remove-video", playlistController.removeVideo);
router.get("/my", playlistController.getMyPlaylists);
router.get("/:id", playlistController.getPlaylist);
router.delete("/:id", playlistController.deletePlaylist);

module.exports = router;
