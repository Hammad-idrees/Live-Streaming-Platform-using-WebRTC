import React from "react";
import { Camera, Mic, Settings } from "lucide-react";

export default function StreamControls({
  cameras,
  microphones,
  selectedCameraId,
  selectedMicId,
  setSelectedCameraId,
  setSelectedMicId,
  showDeviceSettings,
  setShowDeviceSettings,
  streaming,
  switchCamera,
}) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        borderRadius: "12px",
        padding: "16px",
        border: "1px solid #334155",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          cursor: "pointer",
        }}
        onClick={() => setShowDeviceSettings(!showDeviceSettings)}
      >
        <Settings size={20} color="#64748b" />
        <span style={{ fontWeight: "600", color: "#e2e8f0" }}>
          Device Settings
        </span>
        <span style={{ color: "#64748b", fontSize: "14px" }}>
          {showDeviceSettings ? "▼" : "▶"}
        </span>
      </div>

      {showDeviceSettings && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
                fontSize: "14px",
                color: "#94a3b8",
              }}
            >
              <Camera size={16} />
              Camera
            </label>
            <select
              value={selectedCameraId || ""}
              onChange={(e) =>
                streaming
                  ? switchCamera(e.target.value)
                  : setSelectedCameraId(e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "#334155",
                color: "white",
                border: "1px solid #475569",
                fontSize: "14px",
              }}
            >
              {cameras.map((cam) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${cam.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "6px",
                fontSize: "14px",
                color: "#94a3b8",
              }}
            >
              <Mic size={16} />
              Microphone
            </label>
            <select
              value={selectedMicId || ""}
              onChange={(e) => setSelectedMicId(e.target.value)}
              disabled={streaming}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: streaming ? "#1e293b" : "#334155",
                color: streaming ? "#64748b" : "white",
                border: "1px solid #475569",
                fontSize: "14px",
                cursor: streaming ? "not-allowed" : "pointer",
              }}
            >
              {microphones.map((mic) => (
                <option key={mic.deviceId} value={mic.deviceId}>
                  {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
