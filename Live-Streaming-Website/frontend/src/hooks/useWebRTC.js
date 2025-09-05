// WebRTC Hook for managing signaling and chat in a live streaming application
import { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";

/**
 * Custom hook to manage WebRTC signaling and chat via Socket.IO
 * @param {"streamer"|"viewer"} role
 * @param {string} streamId - unique identifier for the stream room
 * @param {function} [onChatMessage] - optional callback to receive chat events
 */
export function useWebRTC(role, streamId, onChatMessage) {
  const socketRef = useRef(null);
  const pcRef = useRef(null);
  const [rtcConfig, setRtcConfig] = useState(null);
  const [username, setUsername] = useState(() => {
    // Load saved username from localStorage on initialization
    return localStorage.getItem("chat-username") || "";
  });
  const [usernameSet, setUsernameSet] = useState(() => {
    // Check if username was previously set
    return Boolean(localStorage.getItem("chat-username"));
  });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SIGNALING_URL);
    socketRef.current = socket;

    // Auto-set username if we have one saved
    const savedUsername = localStorage.getItem("chat-username");
    if (savedUsername && !usernameSet) {
      console.log("👤 [WebRTC] Auto-setting saved username:", savedUsername);
      socket.emit("set-username", { username: savedUsername });
    }

    // Connection events
    socket.on("connect", () =>
      console.log("✅ [WebRTC] Signaling connected (socket id:", socket.id, ")")
    );
    socket.on("disconnect", () =>
      console.log("❌ [WebRTC] Signaling disconnected")
    );
    socket.on("connect_error", (err) =>
      console.error("🚨 [WebRTC] Signaling connection error:", err)
    );

    // Username confirmation
    socket.on("username-set", (data) => {
      if (data.success) {
        console.log("👤 [WebRTC] Username set successfully:", data.username);
        setUsernameSet(true);
        setUsername(data.username);
        // Save username to localStorage for future sessions
        localStorage.setItem("chat-username", data.username);
      } else {
        console.error("🚨 [WebRTC] Username setting failed:", data.error);
        setUsernameSet(false);
        // Clear any invalid saved username
        localStorage.removeItem("chat-username");
      }
    });

    // RTC Configuration
    socket.on("rtcConfig", (config) => {
      console.log("🔧 [WebRTC] Received rtcConfig:", config);
      setRtcConfig(config);

      pcRef.current = new RTCPeerConnection(config);

      pcRef.current.onicecandidate = ({ candidate }) => {
        if (candidate) {
          console.log("🧊 [WebRTC] Local ICE candidate:", candidate);
          socket.emit("ice-candidate", { streamId, candidate });
        }
      };

      pcRef.current.ontrack = ({ streams: [stream] }) => {
        console.log("🎥 [WebRTC] Remote track received:", stream);
      };
    });

    // WebRTC Signaling Events
    socket.on("offer", async ({ streamId: id, offer }) => {
      if (role !== "viewer" || id !== streamId) return;
      console.log("📡 [WebRTC] [Viewer] Offer received:", offer);
      try {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        console.log("📡 [WebRTC] [Viewer] Sending answer:", answer);
        socket.emit("answer", { streamId, answer });
      } catch (err) {
        console.error("🚨 [WebRTC] [Viewer] Error handling offer:", err);
      }
    });

    socket.on("answer", async ({ streamId: id, answer }) => {
      if (role !== "streamer" || id !== streamId) return;
      console.log("📡 [WebRTC] [Streamer] Answer received:", answer);
      try {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (err) {
        console.error(
          "🚨 [WebRTC] [Streamer] Error setting remote description:",
          err
        );
      }
    });

    socket.on("ice-candidate", async ({ streamId: id, candidate }) => {
      if (id !== streamId) return;
      console.log("🧊 [WebRTC] [Peer] ICE candidate received:", candidate);
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("🚨 [WebRTC] Error adding received ICE candidate:", err);
      }
    });

    // Simple Global Chat Events (with sender names)
    if (onChatMessage) {
      socket.on("chat-message", (data) => {
        console.log("💬 [WebRTC] Chat message received:", data);
        onChatMessage({
          ...data,
          type: "message",
          self: false, // Always false since we only receive others' messages
        });
      });
    }

    // Drawing Events
    socket.on("draw", ({ from, to, color, width }) => {
      console.log("🎨 [WebRTC] Drawing event received");
      window.dispatchEvent(
        new CustomEvent("remote-draw", {
          detail: { from, to, color, width },
        })
      );
    });

    socket.on("clear-canvas", () => {
      console.log("🗑️ [WebRTC] Clear canvas event received");
      window.dispatchEvent(new CustomEvent("remote-clear-canvas"));
    });

    return () => {
      console.log("🔌 [WebRTC] Cleaning up WebRTC connection");
      socket.disconnect();
      if (pcRef.current) pcRef.current.close();
    };
  }, [role, streamId, onChatMessage, usernameSet]); // latest change usernameSet

  // Set username function
  const setUserName = (name) => {
    if (socketRef.current && name.trim()) {
      console.log("👤 [WebRTC] Setting username:", name);
      socketRef.current.emit("set-username", { username: name.trim() });
      return true;
    }
    return false;
  };

  // Clear saved username (for logout/reset functionality)
  const clearUsername = () => {
    localStorage.removeItem("chat-username");
    setUsername("");
    setUsernameSet(false);
    console.log("👤 [WebRTC] Username cleared");
  };

  // Simple Chat Functions (matching your socketManager.js)
  const sendChatMessage = (message) => {
    if (socketRef.current && message.trim() && usernameSet) {
      console.log("💬 [WebRTC] Sending chat message:", message);
      socketRef.current.emit("chat-message", { message });
      return true;
    }
    return false;
  };

  return {
    // WebRTC
    socketRef,
    pcRef,
    rtcConfig,

    // Username management
    username,
    usernameSet,
    setUserName,
    clearUsername,

    // Chat
    sendChatMessage,
  };
}
