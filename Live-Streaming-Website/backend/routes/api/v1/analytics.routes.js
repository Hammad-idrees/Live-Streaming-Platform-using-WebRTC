const express = require("express");
const router = express.Router();
const analyticsController = require("../../../controllers/analytics.controller");
const auth = require("../../../middleware/auth");
const roleCheck = require("../../../middleware/roleCheck");

router.get(
  "/platform",
  auth,
  roleCheck(["admin"]),
  analyticsController.getPlatformStats
);

module.exports = router;
