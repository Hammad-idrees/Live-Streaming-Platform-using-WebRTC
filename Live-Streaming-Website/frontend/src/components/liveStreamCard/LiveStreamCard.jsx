import React, { useEffect, useRef, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { Eye, Users, Wifi, WifiOff } from "lucide-react";

const LiveStreamCard = ({ stream, onClick, viewMode = "grid" }) => {
  const previewVideoRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [viewerCount, setViewerCount] = useState(stream.viewerCount || 0);

  // Use WebRTC hook for preview connection
  const { socketRef, pcRef, rtcConfig } = useWebRTC("viewer", stream.id);

  // Set up preview video connection
  useEffect(() => {
    if (!rtcConfig || !stream.isLive) return;

    let timeoutId;

    const setupPreview = () => {
      if (pcRef.current) {
        pcRef.current.ontrack = ({ streams: [videoStream] }) => {
          console.log("📺 [StreamCard] Preview track received for", stream.id);
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = videoStream;
            setConnected(true);
          }
        };

        pcRef.current.onconnectionstatechange = () => {
          const state = pcRef.current.connectionState;
          console.log(`🔗 [StreamCard] Connection state: ${state}`);
          
          if (state === "connected") {
            setConnected(true);
          } else if (state === "disconnected" || state === "failed") {
            setConnected(false);
          }
        };

        // Join as viewer for preview (with a slight delay to avoid conflicts)
        timeoutId = setTimeout(() => {
          console.log("👀 [StreamCard] Joining stream for preview", stream.id);
          socketRef.current?.emit("viewer");
        }, 100);
      }
    };

    setupPreview();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [pcRef, rtcConfig, socketRef, stream.id, stream.isLive]);

  // Listen for viewer count updates
  useEffect(() => {
    if (!socketRef.current) return;

    const handleViewerUpdate = (data) => {
      if (data.streamId === stream.id) {
        setViewerCount(data.count);
      }
    };

    socketRef.current.on("viewer-count-update", handleViewerUpdate);

    return () => {
      socketRef.current?.off("viewer-count-update", handleViewerUpdate);
    };
  }, [socketRef, stream.id]);

  const handleCardClick = () => {
    onClick(stream.id);
  };

  const isGridView = viewMode === "grid";

  return (
    <div
      className={`
        bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-slate-700 hover:border-purple-500
        ${isGridView ? "aspect-[16/10]" : "flex items-center gap-4 p-4 aspect-auto"}
      `}
      onClick={handleCardClick}
    >
      {/* Video Preview Section */}
      <div className={`relative ${isGridView ? "aspect-video" : "w-48 h-28 flex-shrink-0"} bg-slate-900 overflow-hidden`}>
        {stream.isLive ? (
          <>
            <video
              ref={previewVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Connection overlay */}
            {!connected && (
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                  <p className="text-sm text-slate-400">Loading...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center">
              <WifiOff className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Stream Offline</p>
            </div>
          </div>
        )}

        {/* Live indicator */}
        {stream.isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
            {connected && (
              <div className="bg-green-600 text-white p-1 rounded-full">
                <Wifi className="w-3 h-3" />
              </div>
            )}
          </div>
        )}

        {/* Viewer count */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Users className="w-3 h-3" />
          {viewerCount}
        </div>

        {/* Click overlay */}
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <div className="bg-purple-600 text-white p-3 rounded-full transform scale-0 hover:scale-100 transition-transform duration-300">
            <Eye className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stream Info Section */}
      <div className={`${isGridView ? "p-4" : "flex-1 min-w-0"}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg mb-1 line-clamp-2">
              {stream.title || `Stream ${stream.id}`}
            </h3>
            
            <p className="text-slate-400 text-sm mb-2 line-clamp-1">
              {stream.streamerName || stream.username || "Anonymous Streamer"}
            </p>

            {stream.description && (
              <p className="text-slate-500 text-sm line-clamp-2 mb-3">
                {stream.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{viewerCount} viewers</span>
              </div>
              
              {stream.category && (
                <span className="bg-slate-700 px-2 py-1 rounded-md">
                  {stream.category}
                </span>
              )}

              {stream.startedAt && (
                <span>
                  Started {new Date(stream.startedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex-shrink-0">
            {stream.isLive ? (
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            ) : (
              <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamCard;