const { Server } = require("socket.io");
const rtcConfig = require("../config/rtcConfig");

// Add this line at the top with other declarations
const userNames = new Map(); // Stores socket.id -> username mappings

// --- Notification utility ---
/**
 * Emit a notification to a specific user by userId
 * @param {Server} io - The socket.io server instance
 * @param {string} userId - The user's MongoDB _id as string
 * @param {object} payload - { type, message, data }
 */
function sendNotificationToUser(io, userId, payload) {
  if (io && userId) {
    io.to(userId.toString()).emit("notification", payload);
  }
}

module.exports = {
  /**
   * Initialize Socket.IO on your HTTP(S) server
   * and wire up WebRTC signaling and chat.
   *
   * @param {http.Server} server
   */
  initSocket(server) {
    const io = new Server(server, {
      cors: { origin: "*", methods: ["GET", "POST"] },
    });

    io.on("connection", (socket) => {
      console.log("✅ User connected:", socket.id);

      // --- User room join for notifications ---
      socket.on("join-user-room", (userId) => {
        if (userId) {
          socket.join(userId.toString());
          console.log(`User ${userId} joined their notification room.`);
        }
      });

      // Handle username setting
      socket.on("set-username", (data) => {
        const { username } = data;
        if (username && username.trim()) {
          userNames.set(socket.id, username.trim());
          console.log(`👤 User ${socket.id} set username: ${username}`);

          // Confirm username was set
          socket.emit("username-set", {
            success: true,
            username: username.trim(),
          });
        } else {
          socket.emit("username-set", {
            success: false,
            error: "Username cannot be empty",
          });
        }
      });

      // Send RTC config to each client
      socket.emit("rtcConfig", rtcConfig);

      // Handle role joining
      socket.on("streamer", () => {
        console.log("🎥 Streamer joined");
        socket.join("stream");
      });

      socket.on("viewer", () => {
        console.log("👀 Viewer joined");
        socket.join("stream");
      });

      // WebRTC Signaling
      socket.on("offer", (offer) => {
        console.log("📡 Offer");
        socket.to("stream").emit("offer", offer);
      });

      socket.on("answer", (answer) => {
        console.log("📡 Answer");
        socket.to("stream").emit("answer", answer);
      });

      socket.on("ice-candidate", (candidate) => {
        console.log("❄️ ICE candidate");
        socket.to("stream").emit("ice-candidate", candidate);
      });

      // Drawing actions from streamer → viewers
      socket.on("draw", (data) => {
        console.log("🎨 draw", data);
        // Broadcast to everyone in "stream" except the streamer
        socket.to("stream").emit("draw", data);
      });

      socket.on("clear-canvas", () => {
        console.log("🧹 clear canvas");
        socket.to("stream").emit("clear-canvas");
      });

      socket.on("chat-message", (data) => {
        const senderName = userNames.get(socket.id) || "Anonymous";
        console.log(`💬 Chat from ${senderName}: ${data.message}`);

        // Broadcast to ALL other connected clients (not back to sender)
        socket.broadcast.emit("chat-message", {
          message: data.message,
          senderId: socket.id,
          senderName: senderName,
          timestamp: Date.now(),
        });
      });

      socket.on("disconnect", () => {
        // Clean up username when user disconnects
        console.log("🚫 Disconnected:", socket.id);
        userNames.delete(socket.id);
      });
    });

    console.log("[webrtc+chat+notifications] Socket.IO initialized");
    // Attach notification utility to io instance for use elsewhere
    io.sendNotificationToUser = (userId, payload) =>
      sendNotificationToUser(io, userId, payload);
    return io;
  },
  sendNotificationToUser,
};

// Updated with Chat support
