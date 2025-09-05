// routes/turn.js
const express = require("express");
const router = express.Router();
const rtcConfig = require("../config/rtcConfig");

router.get("/", (req, res) => {
  // In future you can guard this endpoint (e.g. check auth)
  res.json({ iceServers: rtcConfig.iceServers });
});

module.exports = router;
