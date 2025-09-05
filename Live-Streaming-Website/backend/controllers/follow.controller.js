const User = require("../models/User");
const pusher = require("../utils/pusher");

// Follow a user
exports.follow = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;
    if (userId.toString() === targetId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: "You cannot follow yourself.",
      });
    }
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found." });
    if (!user.following.includes(targetId)) {
      user.following.push(targetId);
      await user.save();
    }
    if (!target.followers.includes(userId)) {
      target.followers.push(userId);
      await target.save();
    }
    if (target && String(target._id) !== String(userId)) {
      pusher.trigger(`user-${target._id}`, "notification", {
        type: "follow",
        message: `${user.username} followed you!`,
        data: { followerId: userId },
      });
    }
    res.json({
      success: true,
      data: { message: "Followed user." },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Unfollow a user
exports.unfollow = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.id;
    const user = await User.findById(userId);
    const target = await User.findById(targetId);
    if (!target)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found." });
    user.following = user.following.filter((id) => id.toString() !== targetId);
    await user.save();
    target.followers = target.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    await target.save();
    res.json({
      success: true,
      data: { message: "Unfollowed user." },
      error: null,
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers",
      "username avatar"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found." });
    res.json({ success: true, data: user.followers, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};

// Get following of a user
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "following",
      "username avatar"
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found." });
    res.json({ success: true, data: user.following, error: null });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
