const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    socketId: {
      type: String,
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    messageType: {
      type: String,
      enum: ["chat", "system", "notification"],
      default: "chat",
    },
    // Optional: Add room/channel support for future use
    room: {
      type: String,
      default: "global",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient queries
chatMessageSchema.index({ timestamp: -1 });
chatMessageSchema.index({ username: 1, timestamp: -1 });

// Static method to get recent messages
chatMessageSchema.statics.getRecentMessages = async function (
  limit = 50,
  room = "global"
) {
  return this.find({ room }).sort({ timestamp: -1 }).limit(limit).lean(); // Use lean() for better performance when you don't need full mongoose documents
};

// Static method to get messages by user
chatMessageSchema.statics.getMessagesByUser = async function (
  username,
  limit = 100
) {
  return this.find({ username }).sort({ timestamp: -1 }).limit(limit).lean();
};

// Static method to clean old messages (optional cleanup)
chatMessageSchema.statics.cleanOldMessages = async function (
  daysOld = 30,
  room = "global"
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  return this.deleteMany({
    room,
    timestamp: { $lt: cutoffDate },
  });
};

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
