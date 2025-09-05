// utils/signaling-server.js

/**
 * Sets up all WebRTC signaling event handlers on a Socket.IO instance.
 *
 * @param {Server} io - your socket.io server
 * @param {object} rtcConfig - ICE config from config/rtcConfig.js
 */
module.exports = function setupSignaling(io, rtcConfig) {
  let streamerSocket = null;

  io.on("connection", (socket) => {
    console.log("[webrtc] client connected:", socket.id);

    // Client asks to become streamer
    socket.on("streamer", () => {
      streamerSocket = socket;
      console.log("[webrtc] registered streamer:", socket.id);
      // send ICE config to streamer
      socket.emit("rtcConfig", rtcConfig);
    });

    // Client asks to become viewer
    socket.on("viewer", () => {
      console.log("[webrtc] viewer joined:", socket.id);
      socket.emit("rtcConfig", rtcConfig);

      // If streamer already has an offer, send it
      if (streamerSocket && streamerSocket.offer) {
        socket.emit("offer", streamerSocket.offer);
      }
    });

    // Streamer sends SDP offer
    socket.on("offer", (offer) => {
      console.log("[webrtc] received offer from streamer");
      socket.offer = offer;
      // broadcast to all viewers
      socket.broadcast.emit("offer", offer);
    });

    // Viewer sends SDP answer
    socket.on("answer", (answer) => {
      console.log("[webrtc] received answer from viewer");
      if (streamerSocket) {
        streamerSocket.emit("answer", answer);
      }
    });

    // Relay ICE candidates both ways
    socket.on("ice-candidate", (candidate) => {
      socket.broadcast.emit("ice-candidate", candidate);
    });

    // Relay drawing actions from streamer to viewers
    socket.on("draw", (data) => {
      // Only streamer should emit draw events
      if (socket === streamerSocket) {
        socket.broadcast.emit("draw", data);
      }
    });

    socket.on("clear-canvas", () => {
      if (socket === streamerSocket) {
        socket.broadcast.emit("clear-canvas");
      }
    });

    socket.on("disconnect", () => {
      console.log("[webrtc] client disconnected:", socket.id);
      if (socket === streamerSocket) {
        streamerSocket = null;
      }
    });
  });
};
