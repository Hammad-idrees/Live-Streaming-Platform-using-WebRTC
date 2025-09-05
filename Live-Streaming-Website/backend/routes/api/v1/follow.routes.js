const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const followController = require("../../../controllers/follow.controller");

router.use(auth);

router.post("/follow/:id", followController.follow);
router.post("/unfollow/:id", followController.unfollow);
router.get("/followers/:id", followController.getFollowers);
router.get("/following/:id", followController.getFollowing);

module.exports = router;
