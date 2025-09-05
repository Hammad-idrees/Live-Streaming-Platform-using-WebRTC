const express = require("express");
const router = express.Router();
const adminController = require("../../../controllers/admin.controller");
const auth = require("../../../middleware/auth");
const roleCheck = require("../../../middleware/roleCheck");

router.use(auth);
router.use(roleCheck.isAdmin);

router.get("/users", adminController.listUsers);
router.get("/streams", adminController.listStreams);
router.get("/reports", adminController.listReports);
router.put("/reports/:reportId/resolve", adminController.resolveReport);

// Promote/demote streamer
router.put("/users/:userId/promote", adminController.promoteToStreamer);
router.put("/users/:userId/demote", adminController.demoteToUser);

// New routes
router.put("/users/:userId/promote-to-admin", adminController.promoteToAdmin);

router.get("/transcoding-settings", adminController.getTranscodingSettings);
router.put("/transcoding-settings", adminController.updateTranscodingSettings);

module.exports = router;
