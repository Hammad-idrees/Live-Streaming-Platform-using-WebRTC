const express = require("express");
const router = express.Router();
const reportController = require("../../../controllers/report.controller");
const auth = require("../../../middleware/auth");
const roleCheck = require("../../../middleware/roleCheck");

// Create a new report (requires authentication)
router.post("/", auth, reportController.createReport);

// Get all reports (admin only)
router.get("/all", auth, roleCheck(["admin"]), reportController.getAllReports);

// Get user's own reports
router.get("/my-reports", auth, reportController.getUserReports);

// Get specific report details (admin or report creator)
router.get("/:reportId", auth, reportController.getReportDetails);

// Update report status (admin only)
router.put(
  "/:reportId/status",
  auth,
  roleCheck(["admin"]),
  reportController.updateReportStatus
);

module.exports = router;
