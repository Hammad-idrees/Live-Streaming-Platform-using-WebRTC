const express = require("express");
const router = express.Router();
const viewerController = require("../../../controllers/viewer.controller");
const auth = require("../../../middleware/auth");

router.use(auth); // Uncomment when auth middleware is ready

router.post("/join", viewerController.joinStream);
router.post("/leave", viewerController.leaveStream);
router.get("/live", viewerController.listLiveStreams);
router.post(
  "/recently-watched/:id",
  auth,
  viewerController.addRecentlyWatchedStream
);
router.get(
  "/recently-watched",
  auth,
  viewerController.getRecentlyWatchedStreams
);

module.exports = router;
