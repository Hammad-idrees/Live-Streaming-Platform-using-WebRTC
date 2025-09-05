import React, { useEffect, useRef, useState, useCallback } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import Chat from "../../components/chat/Chat";
import StreamControls from "./StreamControls";
import VideoPreview from "./VideoPreview";
import DrawingCanvas from "./DrawingCanvas";
import { useStreamLogic } from "./useStreamLogic";
import { useAudioManager } from "./useAudioManager";
import { useVideoManager } from "./useVideoManager";
import {
  AudioLevelIndicator,
  ErrorDisplay,
  StatusIndicators,
  VideoSettingsPanel,
  StreamStatus,
  ControlButtons,
  DebugPanel,
} from "./StreamComponents";

export default function StreamTab({ streamId }) {
  const localVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#ff0000");
  const [brushSize, setBrushSize] = useState(2);

  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);
  const [selectedMicId, setSelectedMicId] = useState(null);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const chatMessageHandler = useRef(null);

  // Chat message handler that will be set by Chat component
  const handleChatMessage = useCallback((data) => {
    console.log("💬 [Streamer] Chat message received:", data);
    if (chatMessageHandler.current) {
      chatMessageHandler.current(data);
    }
  }, []);

  // WebRTC Hook with chat support
  const {
    socketRef,
    pcRef,
    rtcConfig,
    sendChatMessage,
    username,
    usernameSet,
    setUserName,
    clearUsername,
  } = useWebRTC("streamer", streamId, handleChatMessage);

  // Audio Management Hook
  const {
    audioLevel,
    audioError,
    getAudioConstraints,
    checkAudioPermissions,
    handleAudioError,
    startAudioMonitoring,
    stopAudioMonitoring,
    switchMicrophone,
    applyAudioQuality,
  } = useAudioManager(selectedMicId, streaming, pcRef, streamRef);

  // Video Management Hook
  const {
    selectedResolution,
    selectedQualityPreset,
    customFrameRate,
    customBitRate,
    showVideoSettings,
    setShowVideoSettings,
    getVideoConstraints,
    applyVideoQuality,
    handleResolutionChange,
    handleQualityPresetChange,
    setCustomFrameRate,
    setCustomBitRate,
  } = useVideoManager(
    selectedCameraId,
    streaming,
    pcRef,
    streamRef,
    localVideoRef,
    getAudioConstraints,
    handleAudioError,
    startAudioMonitoring,
    stopAudioMonitoring
  );

  // Enhanced custom hook for stream logic with audio constraints
  const {
    startStream,
    stopStream,
    switchCamera,
    toggleAudio,
    toggleVideo,
    clearCanvas,
  } = useStreamLogic({
    rtcConfig,
    streaming,
    setStreaming,
    setInitializing,
    selectedCameraId,
    selectedMicId,
    setSelectedCameraId,
    setAudioEnabled,
    setVideoEnabled,
    localVideoRef,
    streamRef,
    canvasRef,
    socketRef,
    pcRef,
    streamId,
    videoConstraints: getVideoConstraints(),
    audioConstraints: getAudioConstraints(),
    onAudioError: handleAudioError,
  });

  // Apply video and audio quality when streaming starts
  useEffect(() => {
    if (streaming) {
      const timer = setTimeout(() => {
        applyVideoQuality();
        applyAudioQuality();
        startAudioMonitoring();
      }, 1000);

      return () => {
        clearTimeout(timer);
        stopAudioMonitoring();
      };
    } else {
      stopAudioMonitoring();
    }
  }, [
    streaming,
    applyVideoQuality,
    applyAudioQuality,
    startAudioMonitoring,
    stopAudioMonitoring,
  ]);

  // Get available devices with better error handling
  useEffect(() => {
    const getDevices = async () => {
      try {
        // Check permissions first
        await checkAudioPermissions();

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        const audioInputs = devices.filter((d) => d.kind === "audioinput");

        console.log("🎥 Video devices found:", videoInputs.length);
        console.log("🎤 Audio devices found:", audioInputs.length);

        setCameras(videoInputs);
        setMicrophones(audioInputs);

        if (!selectedCameraId && videoInputs.length > 0) {
          setSelectedCameraId(videoInputs[0].deviceId);
        }
        if (!selectedMicId && audioInputs.length > 0) {
          setSelectedMicId(audioInputs[0].deviceId);
        }

        // Log device info for debugging
        audioInputs.forEach((device, index) => {
          console.log(
            `🎤 Audio device ${index}:`,
            device.label || `Microphone ${index + 1}`
          );
        });
      } catch (error) {
        console.error("Error getting devices:", error);
        handleAudioError(error);
      }
    };

    getDevices();
    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [
    selectedCameraId,
    selectedMicId,
    checkAudioPermissions,
    handleAudioError,
  ]);

  // Debug stream tracks
  useEffect(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      const videoTracks = streamRef.current.getVideoTracks();

      console.log("🔍 Current stream debug:", {
        audioTracks: audioTracks.length,
        videoTracks: videoTracks.length,
        audioEnabled: audioTracks[0]?.enabled,
        audioReadyState: audioTracks[0]?.readyState,
        audioLabel: audioTracks[0]?.label,
      });
    }
  }, [streaming]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#0f172a",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            🎬 Live Stream Studio
          </h1>

          {/* Error Display */}
          <ErrorDisplay audioError={audioError} />

          {/* Audio Level Indicator */}
          <AudioLevelIndicator
            streaming={streaming}
            audioLevel={audioLevel}
            audioError={audioError}
          />

          {/* Device Controls */}
          <StreamControls
            cameras={cameras}
            microphones={microphones}
            selectedCameraId={selectedCameraId}
            selectedMicId={selectedMicId}
            setSelectedCameraId={setSelectedCameraId}
            setSelectedMicId={(micId) => {
              if (streaming) {
                switchMicrophone(micId);
              } else {
                setSelectedMicId(micId);
              }
            }}
            showDeviceSettings={showDeviceSettings}
            setShowDeviceSettings={setShowDeviceSettings}
            streaming={streaming}
            switchCamera={switchCamera}
          />

          {/* Video Quality Controls */}
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setShowVideoSettings(!showVideoSettings)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#1e293b",
                color: "white",
                border: "1px solid #475569",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              🎥 Video Quality
            </button>

            {/* Status Indicators */}
            <StatusIndicators
              selectedResolution={selectedResolution}
              selectedQualityPreset={selectedQualityPreset}
              audioError={audioError}
              audioLevel={audioLevel}
            />
          </div>

          {/* Video Settings Panel */}
          <VideoSettingsPanel
            showVideoSettings={showVideoSettings}
            selectedResolution={selectedResolution}
            selectedQualityPreset={selectedQualityPreset}
            customFrameRate={customFrameRate}
            customBitRate={customBitRate}
            streaming={streaming}
            handleResolutionChange={handleResolutionChange}
            handleQualityPresetChange={handleQualityPresetChange}
            setCustomFrameRate={setCustomFrameRate}
            setCustomBitRate={setCustomBitRate}
            applyVideoQuality={applyVideoQuality}
            applyAudioQuality={applyAudioQuality}
          />
        </div>

        {/* Stream Status and Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "flex-end",
          }}
        >
          {/* Status */}
          <StreamStatus streaming={streaming} />

          {/* Control Buttons */}
          <ControlButtons
            streaming={streaming}
            initializing={initializing}
            videoEnabled={videoEnabled}
            audioEnabled={audioEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            startStream={startStream}
            stopStream={stopStream}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}
      >
        {/* Video and Canvas Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <VideoPreview
            localVideoRef={localVideoRef}
            streaming={streaming}
            initializing={initializing}
            videoEnabled={videoEnabled}
          />

          <DrawingCanvas
            canvasRef={canvasRef}
            streaming={streaming}
            drawingColor={drawingColor}
            setDrawingColor={setDrawingColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            clearCanvas={clearCanvas}
            socketRef={socketRef}
            streamId={streamId}
          />
        </div>

        {/* Chat Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "fit-content",
            minHeight: "600px",
          }}
        >
          <Chat
            socketRef={socketRef}
            sendChatMessage={sendChatMessage}
            userRole="streamer"
            onChatMessage={chatMessageHandler}
            username={username}
            usernameSet={usernameSet}
            setUserName={setUserName}
            clearUsername={clearUsername}
          />
        </div>
      </div>

      {/* Debug Panel */}
      <DebugPanel
        streaming={streaming}
        streamRef={streamRef}
        audioLevel={audioLevel}
        audioError={audioError}
        selectedMicId={selectedMicId}
        selectedCameraId={selectedCameraId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
      />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
