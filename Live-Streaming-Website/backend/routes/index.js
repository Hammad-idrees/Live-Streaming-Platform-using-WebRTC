const express = require("express");
const router = express.Router();

router.use("/api", require("./api"));

router.get("/", (req, res) => {
  res.json({ status: "Live Streaming Backend API is running." });
});

module.exports = router;
