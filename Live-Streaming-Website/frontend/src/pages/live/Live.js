import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import Chat from "../../components/chat/Chat";
import LiveVideoPreview from "./LiveVideoPreview";
import LiveDrawingCanvas from "./LiveDrawingCanvas";
import ConnectionStatus from "./ConnectionStatus";

export default function Live({ streamId }) {
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);
  const [videoQuality, setVideoQuality] = useState("high");
  const chatMessageHandler = useRef(null);

  // Video quality settings
  const videoQualitySettings = {
    low: { width: 640, height: 360, maxBitrate: 500000 },
    medium: { width: 1280, height: 720, maxBitrate: 1500000 },
    high: { width: 1920, height: 1080, maxBitrate: 3000000 },
    ultra: { width: 3840, height: 2160, maxBitrate: 8000000 },
  };

  // Apply video quality (viewer-side display and request preferences)
  const applyVideoQuality = useCallback(async () => {
    if (!pcRef.current || !connected) return;

    try {
      const quality = videoQualitySettings[videoQuality];

      // Apply to video element for optimal display
      if (remoteVideoRef.current) {
        const video = remoteVideoRef.current;

        // Set display constraints
        video.style.maxWidth = `${quality.width}px`;
        video.style.maxHeight = `${quality.height}px`;
        video.style.width = "100%";
        video.style.height = "auto";
        video.style.objectFit = "contain";

        // Request specific quality via constraints (for adaptive streams)
        if (video.srcObject) {
          const videoTrack = video.srcObject.getVideoTracks()[0];
          if (videoTrack && videoTrack.applyConstraints) {
            await videoTrack.applyConstraints({
              width: { ideal: quality.width },
              height: { ideal: quality.height },
              frameRate: { ideal: videoQuality === "ultra" ? 60 : 30 },
            });
          }
        }
      }

      // Send quality preference to streamer via signaling
      if (socketRef.current) {
        socketRef.current.emit("viewer-quality-preference", {
          streamId: streamId || "default",
          quality: videoQuality,
          resolution: quality,
        });
      }

      console.log(
        `📹 [Viewer] Video quality preference set to ${videoQuality}`,
        quality
      );
    } catch (error) {
      console.log("📹 [Viewer] Video quality adjustment:", error.message);
    }
  }, [videoQuality, connected, streamId]);

  // Chat message handler that will be set by Chat component
  const handleChatMessage = useCallback((data) => {
    console.log("💬 [Live] Chat message received:", data);
    if (chatMessageHandler.current) {
      chatMessageHandler.current(data);
    }
  }, []);

  // ⛓️ Hook that handles signaling + chat
  const {
    socketRef,
    pcRef,
    rtcConfig,
    sendChatMessage,
    username,
    usernameSet,
    setUserName,
    clearUsername,
  } = useWebRTC("viewer", streamId, handleChatMessage);

  // Audio level visualization
  const visualizeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average audio level
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1

    setAudioLevel(normalizedLevel);

    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  }, []);

  // Setup audio analysis
  const setupAudioAnalysis = useCallback(
    (stream) => {
      try {
        // Create audio context if not exists
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        source.connect(analyser);
        analyserRef.current = analyser;

        // Start visualization
        visualizeAudio();
        setHasAudio(true);

        console.log("🎵 [Viewer] Audio analysis setup complete");
      } catch (error) {
        console.error("❌ [Viewer] Audio analysis setup failed:", error);
      }
    },
    [visualizeAudio]
  );

  // Toggle audio
  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => {
      const newState = !prev;
      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = !newState;
      }
      return newState;
    });
  }, []);

  // 📺 Join stream + handle video and audio
  useEffect(() => {
    if (!rtcConfig) return;

    pcRef.current.ontrack = ({ track, streams: [stream] }) => {
      console.log(`📺 [Viewer] Remote ${track.kind} track received`, stream);

      if (track.kind === "video" && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;

        // Enhanced video quality settings
        remoteVideoRef.current.onloadedmetadata = () => {
          console.log("📹 Video metadata loaded");
          applyVideoQuality(); // Apply quality settings when video loads

          // Enable picture-in-picture if supported
          if (document.pictureInPictureEnabled) {
            remoteVideoRef.current.setAttribute("controls", "");
          }
        };
      }

      if (track.kind === "audio") {
        console.log("🎵 [Viewer] Setting up audio stream");

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.muted = !audioEnabled;

          // Setup audio analysis after audio starts playing
          remoteAudioRef.current.onplay = () => {
            console.log("🎵 [Viewer] Audio started playing");
            setupAudioAnalysis(stream);
          };
        }
      }

      setConnected(true);
    };

    // Enhanced ICE connection state logging
    pcRef.current.oniceconnectionstatechange = () => {
      console.log(
        "🧊 [Viewer] ICE connection state:",
        pcRef.current.iceConnectionState
      );
    };

    console.log(
      "👀 [Viewer] Joining stream room",
      streamId || "default-stream"
    );
    socketRef.current.emit("viewer", {
      streamId: streamId || "default-stream",
    });
  }, [
    pcRef,
    rtcConfig,
    socketRef,
    streamId,
    audioEnabled,
    setupAudioAnalysis,
    applyVideoQuality,
  ]);

  // Apply video quality when changed
  useEffect(() => {
    if (connected) {
      applyVideoQuality();
    }
  }, [videoQuality, connected, applyVideoQuality]);

  // Cleanup audio analysis on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // 🎨 Handle drawing (unchanged)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    function handleDraw({ from, to, color, width }) {
      const fromPx = { x: from.x * canvas.width, y: from.y * canvas.height };
      const toPx = { x: to.x * canvas.width, y: to.y * canvas.height };
      ctx.beginPath();
      ctx.moveTo(fromPx.x, fromPx.y);
      ctx.lineTo(toPx.x, toPx.y);
      ctx.strokeStyle = color || "#ff0000";
      ctx.lineWidth = width || 2;
      ctx.stroke();
    }

    function handleClear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const socket = socketRef.current;
    socket.on("draw", handleDraw);
    socket.on("clear-canvas", handleClear);
    return () => {
      socket.off("draw", handleDraw);
      socket.off("clear-canvas", handleClear);
    };
  }, [socketRef]);

  return (
    <div className="p-5 max-w-screen-xl mx-auto bg-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            📺 Live Stream Viewer
          </h1>
        </div>

        {/* Video Quality & Audio Controls */}
        {connected && (
          <div className="flex items-center gap-4">
            {/* Video Quality Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">📹</span>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="low">360p (Low)</option>
                <option value="medium">720p (HD)</option>
                <option value="high">1080p (FHD)</option>
                <option value="ultra">4K (Ultra)</option>
              </select>
            </div>
            {/* Audio Level Indicator */}
            {hasAudio && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">🎵</span>
                <div className="w-20 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100 ease-out"
                    style={{
                      width: `${audioLevel * 100}%`,
                      opacity: audioEnabled ? 1 : 0.3,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">
                  {Math.round(audioLevel * 100)}%
                </span>
              </div>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                audioEnabled
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {audioEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        )}

        {/* Connection Status */}
        <ConnectionStatus connected={connected} />
      </div>

      {/* Hidden Audio Element with Enhanced Settings */}
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        preload="auto"
        style={{ display: "none" }}
        onError={(e) => console.error("🎵 [Viewer] Audio error:", e)}
        onCanPlay={() => console.log("🎵 [Viewer] Audio can play")}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video and Canvas Section */}
        <div className="lg:col-span-2 space-y-5">
          <LiveVideoPreview
            remoteVideoRef={remoteVideoRef}
            connected={connected}
          />

          <LiveDrawingCanvas canvasRef={canvasRef} connected={connected} />
        </div>

        {/* Chat Section */}
        <div className="flex flex-col h-fit min-h-96 lg:min-h-screen">
          <Chat
            socketRef={socketRef}
            sendChatMessage={sendChatMessage}
            userRole="viewer"
            onChatMessage={chatMessageHandler}
            username={username}
            usernameSet={usernameSet}
            setUserName={setUserName}
            clearUsername={clearUsername}
          />
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
          <div>Stream ID: {streamId || "undefined"}</div>
          <div>Connected: {connected ? "✅" : "❌"}</div>
          <div>Audio: {hasAudio ? "✅" : "❌"}</div>
          <div>Audio Enabled: {audioEnabled ? "✅" : "❌"}</div>
          <div>Audio Level: {Math.round(audioLevel * 100)}%</div>
          <div>Video Quality: {videoQuality}</div>
          <div>
            Video Resolution: {videoQualitySettings[videoQuality].width}x
            {videoQualitySettings[videoQuality].height}
          </div>
          <div>ICE State: {pcRef.current?.iceConnectionState || "unknown"}</div>
          <div>
            Connection State: {pcRef.current?.connectionState || "unknown"}
          </div>
        </div>
      )}
    </div>
  );
}
