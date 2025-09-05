const platformService = require("../services/analytics/platform.service");

exports.getPlatformStats = async (req, res) => {
  try {
    const stats = await platformService.getPlatformStats();
    res.json({ success: true, data: stats, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};
