import React from "react";

export default function ConnectionStatus({ connected }) {
  return (
    <div className="flex flex-col gap-3 items-end">
      <div
        className={`
        flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
        ${
          connected
            ? "bg-emerald-900/80 border-emerald-500 shadow-emerald-500/20 shadow-lg"
            : "bg-amber-900/80 border-amber-500 shadow-amber-500/20 shadow-lg"
        }
      `}
      >
        <div
          className={`
            w-2 h-2 rounded-full transition-colors duration-300
            ${connected ? "bg-emerald-400" : "bg-amber-400"}
          `}
          style={{
            animation: connected
              ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              : "none",
          }}
        />
        <span
          className={`
          text-sm font-semibold transition-colors duration-300
          ${connected ? "text-emerald-100" : "text-amber-100"}
        `}
        >
          {connected ? "🔴 CONNECTED" : "⚪ CONNECTING..."}
        </span>
      </div>

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
      `}</style>
    </div>
  );
}
