const messageService = require("../services/chat/message.service");
const moderationService = require("../services/chat/moderation.service");
const translationService = require("../services/chat/translation.service");
const Stream = require("../models/Stream");
const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  try {
    const { streamId, message } = req.body;
    const userId = req.user._id;
    // Moderate message
    const isClean = await moderationService.moderateMessage(message);
    if (!isClean)
      return res
        .status(400)
        .json({
          success: false,
          data: null,
          error: "Message flagged by moderation",
        });
    // Translate message (optional)
    const translatedMessage = await translationService.translateMessage(
      message,
      req.body.targetLang || "en"
    );
    const chat = await messageService.sendMessage(streamId, userId, message);
    chat.translatedMessage = translatedMessage;
    await chat.save();
    res.status(201).json({ success: true, data: chat, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.fetchMessages = async (req, res) => {
  try {
    const { streamId } = req.params;
    const messages = await messageService.fetchMessages(streamId);
    res.json({ success: true, data: messages, error: null });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const { streamId, userId } = req.body;
    const stream = await Stream.findById(streamId);
    if (!stream)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Stream not found" });
    // Only streamer or admin can ban
    if (
      String(stream.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, data: null, error: "Forbidden" });
    }
    if (!stream.bannedUsers.includes(userId)) {
      stream.bannedUsers.push(userId);
      await stream.save();
    }
    res.json({
      success: true,
      data: { message: "User banned from chat" },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const chat = await Chat.findById(messageId).populate("stream");
    if (!chat)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Message not found" });
    // Only streamer or admin can delete
    if (
      String(chat.stream.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, data: null, error: "Forbidden" });
    }
    await chat.deleteOne();
    res.json({
      success: true,
      data: { message: "Message deleted" },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};

exports.getChatAnalytics = async (req, res) => {
  try {
    const { streamId } = req.params;
    // Only streamer or admin can view analytics
    const stream = await Stream.findById(streamId);
    if (!stream)
      return res
        .status(404)
        .json({ success: false, data: null, error: "Stream not found" });
    if (
      String(stream.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, data: null, error: "Forbidden" });
    }
    const messages = await Chat.find({ stream: streamId });
    const totalMessages = messages.length;
    const uniqueChatters = new Set(messages.map((m) => String(m.user))).size;
    // Messages per minute (activity graph)
    const activity = {};
    messages.forEach((msg) => {
      const minute = new Date(msg.timestamp).toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
      activity[minute] = (activity[minute] || 0) + 1;
    });
    res.json({
      success: true,
      data: { totalMessages, uniqueChatters, activity },
      error: null,
    });
  } catch (err) {
    res.status(400).json({ success: false, data: null, error: err.message });
  }
};
