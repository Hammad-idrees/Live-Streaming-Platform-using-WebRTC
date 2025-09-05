const User = require("../models/User");
const jwtService = require("../services/auth/jwt.service");
const bcrypt = require("bcryptjs");
const pusher = require("../utils/pusher");

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, age } = req.body;
    let userRole = "user";
    if (role && ["user", "streamer"].includes(role)) {
      userRole = role;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: userRole,
      age,
    });
    res.status(201).json({ success: true, data: user, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, data: null, error: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, data: null, error: "Invalid credentials" });
    const token = jwtService.signToken({ id: user._id, role: user.role });
    res.json({ success: true, data: { token, user }, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ success: true, data: user, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Prevent role change
    if ("role" in updates) delete updates.role;
    // Handle avatar upload
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }
    // Handle password change with current password verification
    if (updates.password) {
      if (!updates.currentPassword) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Current password is required to change password.",
        });
      }
      const user = await User.findById(req.user._id);
      const isMatch = await bcrypt.compare(
        updates.currentPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          data: null,
          error: "Current password is incorrect.",
        });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
      delete updates.currentPassword;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json({ success: true, data: user, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};
// This is the function that upgrades a user to a streamer from the dashboard
// Tested and working on Postman
exports.upgradeToStreamer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, data: null, error: "User not found" });
    if (user.role === "streamer") {
      return res
        .status(400)
        .json({ success: false, data: null, error: "Already a streamer" });
    }
    if (user.role !== "user") {
      return res.status(400).json({
        success: false,
        data: null,
        error: "Only viewers can upgrade to streamer",
      });
    }
    user.role = "streamer";
    await user.save();
    // Issue a new token with the updated role
    const token = jwtService.signToken({ id: user._id, role: user.role });
    res.json({
      success: true,
      data: { message: "Upgraded to streamer", token, user },
      error: null,
    });
    pusher.trigger(`user-${user._id}`, "notification", {
      type: "admin",
      message: `Your account was upgraded to streamer!`,
      data: { userId: user._id },
    });
  } catch (err) {
    res.status(500).json({ success: false, data: null, error: err.message });
  }
};
