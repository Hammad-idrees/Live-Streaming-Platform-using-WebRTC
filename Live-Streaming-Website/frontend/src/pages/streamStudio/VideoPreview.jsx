import React from "react";
import { VideoOff } from "lucide-react";

export default function VideoPreview({
  localVideoRef,
  streaming,
  initializing,
  videoEnabled,
}) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#000",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
        border: "1px solid #334155",
      }}
    >
      {!streaming && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#94a3b8",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>
            {initializing ? "🔄" : "📹"}
          </div>
          <p style={{ margin: 0, fontSize: "18px", fontWeight: "500" }}>
            {initializing ? "Initializing camera..." : "Ready to stream"}
          </p>
        </div>
      )}

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "450px",
          objectFit: "cover",
          display: streaming ? "block" : "none",
        }}
      />

      {!videoEnabled && streaming && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#f87171",
            textAlign: "center",
          }}
        >
          <VideoOff size={48} />
          <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>Camera Off</p>
        </div>
      )}
    </div>
  );
}
