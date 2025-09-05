const Report = require("../models/Report");
const User = require("../models/User");

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason } = req.body;
    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
    });
    await report.populate("reporter", "username");
    res.status(201).json({ success: true, data: report, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Get all reports for admin
exports.getAllReports = async (req, res) => {
  try {
    const { status, targetType } = req.query;
    const query = {};

    if (status) query.status = status;
    if (targetType) query.targetType = targetType;

    const reports = await Report.find(query)
      .populate("reporter", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reports, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Get reports created by the user
exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .populate("reporter", "username")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reports, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Update report status (admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, data: null, error: "Invalid status" });
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    ).populate("reporter", "username");

    if (!report) {
      return res
        .status(404)
        .json({ success: false, data: null, error: "Report not found" });
    }

    res.json({ success: true, data: report, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

// Get report details
exports.getReportDetails = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId).populate(
      "reporter",
      "username"
    );

    if (!report) {
      return res
        .status(404)
        .json({ success: false, data: null, error: "Report not found" });
    }

    res.json({ success: true, data: report, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};
