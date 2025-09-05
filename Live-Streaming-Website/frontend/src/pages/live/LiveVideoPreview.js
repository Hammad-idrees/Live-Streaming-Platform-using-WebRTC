import React from "react";

export default function LiveVideoPreview({ remoteVideoRef, connected }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-600 shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold text-slate-200 m-0">
          📹 Live Video Feed
        </h3>
        {connected && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-400 font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-inner">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          muted
          className={`
            w-full h-full object-cover transition-opacity duration-500
            ${connected ? "opacity-100" : "opacity-0"}
          `}
        />

        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 backdrop-blur-sm">
            <div className="text-6xl mb-4 opacity-40 animate-bounce">📺</div>
            <div className="text-center px-4">
              <p className="text-lg font-medium mb-2">
                Waiting for streamer...
              </p>
              <p className="text-sm opacity-75">
                The stream will appear here once the streamer goes live
              </p>
            </div>
            <div className="flex space-x-1 mt-4">
              <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
