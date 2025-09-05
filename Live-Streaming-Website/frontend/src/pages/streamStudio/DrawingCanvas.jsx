import React, { useEffect, useState, useRef } from "react";
import {
  Palette,
  Eraser,
  Download,
  RotateCcw,
  Eye,
  EyeOff,
  Settings,
  Brush,
  Minus,
  Plus,
} from "lucide-react";

export default function DrawingCanvas({
  canvasRef,
  streaming,
  drawingColor,
  setDrawingColor,
  brushSize,
  setBrushSize,
  clearCanvas,
  socketRef,
  streamId,
}) {
  const [tool, setTool] = useState("brush"); // brush, eraser
  const [opacity, setOpacity] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSettings, setShowSettings] = useState(false);
  const overlayCanvasRef = useRef(null);

  // Predefined color palette
  const colorPalette = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff8000",
    "#8000ff",
    "#0080ff",
    "#ff0080",
    "#80ff00",
    "#ff4000",
    "#4000ff",
    "#ff6b35",
    "#f7931e",
    "#ffd23f",
  ];

  // Brush size presets
  const brushPresets = [1, 3, 5, 8, 12, 20];

  // Save canvas state for undo functionality
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo functionality
  const undo = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    img.src = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);

    // Emit undo to other clients
    socketRef.current?.emit("canvas-undo", { streamId });
  };

  // Download canvas as image
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Draw grid overlay
  const drawGrid = () => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext("2d");
    const { width, height } = overlayCanvas;

    ctx.clearRect(0, 0, width, height);

    if (!showGrid) return;

    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    const gridSize = 20;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  // 🎨 Enhanced drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    if (!canvas || !overlayCanvas || !streaming) return;

    const ctx = canvas.getContext("2d");
    let drawing = false;
    let lastPoint = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      overlayCanvas.width = canvas.clientWidth;
      overlayCanvas.height = canvas.clientHeight;
      drawGrid();
    };

    resize();
    window.addEventListener("resize", resize);
    drawGrid();

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x, y };
    };

    const startDraw = (e) => {
      drawing = true;
      setIsDrawing(true);
      lastPoint = getPos(e);
      saveCanvasState();
    };

    const draw = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const newPoint = getPos(e);

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(newPoint.x, newPoint.y);

      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = drawingColor;
      }

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = opacity / 100;
      ctx.stroke();
      ctx.globalAlpha = 1;

      const from = {
        x: lastPoint.x / canvas.width,
        y: lastPoint.y / canvas.height,
      };
      const to = {
        x: newPoint.x / canvas.width,
        y: newPoint.y / canvas.height,
      };

      socketRef.current?.emit("draw", {
        streamId,
        from,
        to,
        color: drawingColor,
        width: brushSize,
        tool,
        opacity,
      });

      lastPoint = newPoint;
    };

    const endDraw = () => {
      drawing = false;
      setIsDrawing(false);
      ctx.globalCompositeOperation = "source-over";
    };

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    canvas.addEventListener("touchstart", startDraw);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", endDraw);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [socketRef, streaming, drawingColor, brushSize, streamId, tool, opacity]);

  // Update grid when showGrid changes
  useEffect(() => {
    drawGrid();
  }, [showGrid]);

  return (
    <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Live Drawing Studio
            </h3>
            <p className="text-xs text-slate-400">
              {streaming
                ? isDrawing
                  ? "🎨 Drawing..."
                  : "✨ Ready to draw"
                : "⏸️ Waiting for stream"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {streaming && (
            <button
              onClick={downloadCanvas}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Settings Panel */}
      {showSettings && streaming && (
        <div className="mb-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opacity Control */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Opacity: {opacity}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Grid Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">
                Show Grid
              </span>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {showGrid ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      {streaming && (
        <div className="mb-4 space-y-3">
          {/* Tool Selection */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool("brush")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                tool === "brush"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              <Brush className="w-4 h-4" />
              <span className="text-sm">Brush</span>
            </button>

            <button
              onClick={() => setTool("eraser")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                tool === "eraser"
                  ? "bg-red-600 text-white"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span className="text-sm">Eraser</span>
            </button>

            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-300 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Undo</span>
            </button>

            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <span className="text-sm">🗑️ Clear All</span>
            </button>
          </div>

          {/* Color Palette */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-300 mr-2">Colors:</span>
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setDrawingColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  drawingColor === color
                    ? "border-white scale-110"
                    : "border-slate-600"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={drawingColor}
              onChange={(e) => setDrawingColor(e.target.value)}
              className="w-8 h-8 rounded-full border-2 border-slate-600 cursor-pointer"
            />
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-300">Size:</span>
            <button
              onClick={() => setBrushSize(Math.max(1, brushSize - 1))}
              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              <Minus className="w-3 h-3" />
            </button>

            <div className="flex gap-1">
              {brushPresets.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    brushSize === size
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={() => setBrushSize(Math.min(50, brushSize + 1))}
              className="p-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              <Plus className="w-3 h-3" />
            </button>

            <span className="text-sm text-slate-400 ml-2">{brushSize}px</span>

            {/* Brush Preview */}
            <div className="ml-4 p-2 bg-slate-900 rounded">
              <div
                className="rounded-full"
                style={{
                  width: Math.max(brushSize, 4),
                  height: Math.max(brushSize, 4),
                  backgroundColor: tool === "eraser" ? "#ef4444" : drawingColor,
                  opacity: opacity / 100,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas Container */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          className={`block w-full h-96 ${
            streaming
              ? tool === "eraser"
                ? "cursor-cell"
                : "cursor-crosshair"
              : "cursor-not-allowed"
          }`}
        />
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-96 pointer-events-none"
        />

        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <div className="text-4xl mb-3 opacity-50">🎨</div>
              <p className="text-lg font-medium">
                Start streaming to unlock drawing tools
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Share your creativity with the world
              </p>
            </div>
          </div>
        )}

        {streaming && isDrawing && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
            🔴 Drawing Live
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-3 flex justify-between items-center text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span>Tool: {tool === "brush" ? "🖌️ Brush" : "🧹 Eraser"}</span>
          <span>Size: {brushSize}px</span>
          <span>Opacity: {opacity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">● Live</span>
          <span>History: {history.length}</span>
        </div>
      </div>
    </div>
  );
}
