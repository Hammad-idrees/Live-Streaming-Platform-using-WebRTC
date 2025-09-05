// config/rtcConfig.js

/**
 * ICE configuration for WebRTC PeerConnections.
 * Right now we only have a public STUN server.
 * When you add TURN later, uncomment and use your .env vars.
 */
module.exports = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // {
    //   urls: process.env.TURN_URL,
    //   username: process.env.TURN_USER,
    //   credential: process.env.TURN_PASS
    // }
  ],
  iceTransportPolicy: "all",
  bundlePolicy: "balanced",
  rtcpMuxPolicy: "require",
  iceCandidatePoolSize: 0,
};
