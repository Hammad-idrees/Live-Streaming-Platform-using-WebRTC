import React from "react";

export default function LiveDrawingCanvas({ canvasRef, connected }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-600 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-200 m-0">
            🎨 Live Drawing
          </h3>
          {connected && (
            <div className="px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded-md">
              <span className="text-xs text-purple-300 font-medium">
                Interactive
              </span>
            </div>
          )}
        </div>

        {connected && (
          <div className="text-xs text-slate-400">
            Watch the streamer draw in real-time
          </div>
        )}
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden shadow-inner border border-slate-700">
        <canvas
          ref={canvasRef}
          className={`
            w-full block transition-all duration-300
            ${
              connected
                ? "cursor-crosshair opacity-100"
                : "cursor-default opacity-50"
            }
          `}
          style={{ height: "360px" }}
        />

        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900/60 backdrop-blur-sm pointer-events-none">
            <div className="text-5xl mb-4 opacity-40">🎨</div>
            <div className="text-center px-4">
              <p className="text-base font-medium mb-2">Drawing Canvas Ready</p>
              <p className="text-sm opacity-75 max-w-xs">
                Live drawings and annotations will appear here when the stream
                starts
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-600/50">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
              <span className="text-xs text-slate-400">
                Waiting for data...
              </span>
            </div>
          </div>
        )}

        {/* Canvas Border Glow Effect when Connected */}
        {connected && (
          <div className="absolute inset-0 rounded-lg border-2 border-purple-500/20 pointer-events-none animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
