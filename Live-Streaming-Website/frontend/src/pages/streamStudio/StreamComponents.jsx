import React from "react";
import { VIDEO_RESOLUTIONS, VIDEO_QUALITY_PRESETS } from "./constants";

// Audio Level Indicator Component
export const AudioLevelIndicator = ({ streaming, audioLevel, audioError }) => {
  if (!streaming) return null;

  return (
    <div
      style={{
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "14px", color: "#94a3b8", minWidth: "80px" }}>
        🎤 Audio Level:
      </span>
      <div
        style={{
          flex: 1,
          maxWidth: "200px",
          height: "8px",
          backgroundColor: "#374151",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${audioLevel}%`,
            height: "100%",
            backgroundColor:
              audioLevel > 60
                ? "#ef4444"
                : audioLevel > 30
                ? "#f59e0b"
                : "#10b981",
            transition: "width 0.1s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "40px" }}>
        {Math.round(audioLevel)}%
      </span>
    </div>
  );
};

// Error Display Component
export const ErrorDisplay = ({ audioError }) => {
  if (!audioError) return null;

  return (
    <div
      style={{
        marginBottom: "16px",
        padding: "12px",
        backgroundColor: "#dc2626",
        borderRadius: "6px",
        border: "1px solid #ef4444",
        fontSize: "14px",
        color: "#fecaca",
      }}
    >
      ⚠️ Audio Issue: {audioError}
    </div>
  );
};

// Status Indicators Component
export const StatusIndicators = ({
  selectedResolution,
  selectedQualityPreset,
  audioError,
  audioLevel,
}) => (
  <div
    style={{
      marginTop: "16px",
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "center",
    }}
  >
    <div
      style={{
        padding: "6px 12px",
        backgroundColor: "#374151",
        borderRadius: "4px",
        fontSize: "12px",
        color: "#d1d5db",
      }}
    >
      {VIDEO_RESOLUTIONS[selectedResolution].label} •{" "}
      {VIDEO_QUALITY_PRESETS[selectedQualityPreset].frameRate}fps
    </div>

    <div
      style={{
        padding: "6px 12px",
        backgroundColor: audioError
          ? "#dc2626"
          : audioLevel > 5
          ? "#065f46"
          : "#92400e",
        borderRadius: "4px",
        fontSize: "12px",
        color: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      {audioError ? "🔇" : audioLevel > 5 ? "🎤" : "🔕"}
      {audioError ? "Error" : audioLevel > 5 ? "Audio OK" : "No Audio"}
    </div>
  </div>
);

// Video Settings Panel Component
export const VideoSettingsPanel = ({
  showVideoSettings,
  selectedResolution,
  selectedQualityPreset,
  customFrameRate,
  customBitRate,
  streaming,
  handleResolutionChange,
  handleQualityPresetChange,
  setCustomFrameRate,
  setCustomBitRate,
  applyVideoQuality,
  applyAudioQuality,
}) => {
  if (!showVideoSettings) return null;

  return (
    <div
      style={{
        marginTop: "12px",
        padding: "16px",
        backgroundColor: "#1e293b",
        borderRadius: "8px",
        border: "1px solid #475569",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          color: "#f1f5f9",
        }}
      >
        Video Quality Settings
      </h3>

      {/* Resolution Selection */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#cbd5e1",
          }}
        >
          Resolution:
        </label>
        <select
          value={selectedResolution}
          onChange={(e) => handleResolutionChange(e.target.value)}
          disabled={streaming}
          style={{
            padding: "8px 12px",
            backgroundColor: "#374151",
            color: "white",
            border: "1px solid #4b5563",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: streaming ? "not-allowed" : "pointer",
            opacity: streaming ? 0.6 : 1,
          }}
        >
          {Object.entries(VIDEO_RESOLUTIONS).map(([key, res]) => (
            <option key={key} value={key}>
              {res.label} ({res.width}x{res.height})
            </option>
          ))}
        </select>
      </div>

      {/* Quality Preset Selection */}
      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#cbd5e1",
          }}
        >
          Quality Preset:
        </label>
        <select
          value={selectedQualityPreset}
          onChange={(e) => handleQualityPresetChange(e.target.value)}
          style={{
            padding: "8px 12px",
            backgroundColor: "#374151",
            color: "white",
            border: "1px solid #4b5563",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {Object.entries(VIDEO_QUALITY_PRESETS).map(([key, preset]) => (
            <option key={key} value={key}>
              {preset.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Settings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            Frame Rate (fps):
          </label>
          <input
            type="number"
            min="10"
            max="60"
            value={customFrameRate}
            onChange={(e) => setCustomFrameRate(parseInt(e.target.value) || 30)}
            style={{
              padding: "6px 8px",
              backgroundColor: "#374151",
              color: "white",
              border: "1px solid #4b5563",
              borderRadius: "4px",
              fontSize: "12px",
              width: "100%",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "12px",
              color: "#94a3b8",
            }}
          >
            Bitrate (kbps):
          </label>
          <input
            type="number"
            min="250"
            max="10000"
            value={Math.round(customBitRate / 1000)}
            onChange={(e) =>
              setCustomBitRate((parseInt(e.target.value) || 2500) * 1000)
            }
            style={{
              padding: "6px 8px",
              backgroundColor: "#374151",
              color: "white",
              border: "1px solid #4b5563",
              borderRadius: "4px",
              fontSize: "12px",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Apply Settings Button */}
      {streaming && (
        <button
          onClick={() => {
            applyVideoQuality();
            applyAudioQuality();
          }}
          style={{
            marginTop: "12px",
            padding: "8px 16px",
            backgroundColor: "#059669",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Apply Quality Settings
        </button>
      )}
    </div>
  );
};

// Stream Status Component
export const StreamStatus = ({ streaming }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      borderRadius: "20px",
      backgroundColor: streaming ? "#065f46" : "#92400e",
      border: `1px solid ${streaming ? "#10b981" : "#f59e0b"}`,
    }}
  >
    <div
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: streaming ? "#10b981" : "#f59e0b",
        animation: streaming ? "pulse 2s infinite" : "none",
      }}
    />
    <span
      style={{
        fontSize: "14px",
        fontWeight: "600",
        color: streaming ? "#d1fae5" : "#fef3c7",
      }}
    >
      {streaming ? "🔴 LIVE" : "⚪ OFFLINE"}
    </span>
  </div>
);

// Control Buttons Component
export const ControlButtons = ({
  streaming,
  initializing,
  videoEnabled,
  audioEnabled,
  toggleVideo,
  toggleAudio,
  startStream,
  stopStream,
}) => (
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
    {streaming && (
      <>
        <button
          onClick={toggleVideo}
          style={{
            padding: "10px",
            backgroundColor: videoEnabled ? "#1e293b" : "#dc2626",
            color: "white",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          title={videoEnabled ? "Turn off camera" : "Turn on camera"}
        >
          {videoEnabled ? "📹" : "📷"}
        </button>

        <button
          onClick={toggleAudio}
          style={{
            padding: "10px",
            backgroundColor: audioEnabled ? "#1e293b" : "#dc2626",
            color: "white",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
          title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
        >
          {audioEnabled ? "🎤" : "🔇"}
        </button>
      </>
    )}

    {!streaming ? (
      <button
        onClick={startStream}
        disabled={initializing}
        style={{
          padding: "12px 24px",
          backgroundColor: initializing ? "#64748b" : "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: initializing ? "not-allowed" : "pointer",
          transition: "all 0.2s",
          boxShadow: initializing
            ? "none"
            : "0 4px 12px rgba(220, 38, 38, 0.3)",
        }}
      >
        {initializing ? "🔄 Starting..." : "🔴 Start Stream"}
      </button>
    ) : (
      <button
        onClick={stopStream}
        style={{
          padding: "12px 24px",
          backgroundColor: "#374151",
          color: "white",
          border: "1px solid #4b5563",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "16px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        ⏹️ Stop Stream
      </button>
    )}
  </div>
);

// Debug Panel Component
export const DebugPanel = ({
  streaming,
  streamRef,
  audioLevel,
  audioError,
  selectedMicId,
  selectedCameraId,
  audioEnabled,
  videoEnabled,
}) => {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        border: "1px solid #333",
        fontSize: "12px",
        fontFamily: "monospace",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", color: "#fbbf24" }}>🔍 Debug Info</h3>
      <div style={{ color: "#94a3b8" }}>
        <div>Stream Active: {streaming ? "✅" : "❌"}</div>
        <div>
          Audio Tracks: {streamRef.current?.getAudioTracks().length || 0}
        </div>
        <div>
          Video Tracks: {streamRef.current?.getVideoTracks().length || 0}
        </div>
        <div>Audio Level: {audioLevel.toFixed(1)}%</div>
        <div>Audio Error: {audioError || "None"}</div>
        <div>Selected Mic: {selectedMicId || "None"}</div>
        <div>Selected Camera: {selectedCameraId || "None"}</div>
        <div>Audio Enabled: {audioEnabled ? "✅" : "❌"}</div>
        <div>Video Enabled: {videoEnabled ? "✅" : "❌"}</div>
      </div>
    </div>
  );
};
