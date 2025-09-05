const Chat = require("../../models/Chat");

async function sendMessage(streamId, userId, message) {
  // Placeholder: Add moderation/translation hooks
  const chat = await Chat.create({
    stream: streamId,
    user: userId,
    message,
  });
  return chat;
}

async function fetchMessages(streamId, limit = 50) {
  return Chat.find({ stream: streamId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate("user", "username avatar");
}

module.exports = { sendMessage, fetchMessages };
