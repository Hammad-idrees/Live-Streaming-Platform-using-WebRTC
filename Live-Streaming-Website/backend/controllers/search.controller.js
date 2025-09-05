const Vod = require("../models/Vod");

// Simple keyword search for VODs
exports.searchVods = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q)
      return res
        .status(400)
        .json({ success: false, data: null, error: "Query is required" });
    const vods = await Vod.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).populate(Vod.userPopulation());
    res.json({ success: true, data: vods, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
