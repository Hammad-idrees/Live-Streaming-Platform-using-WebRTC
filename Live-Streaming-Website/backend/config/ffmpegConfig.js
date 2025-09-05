// config/ffmpegConfig.js
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

// Set FFmpeg path explicitly for Windows
const ffmpegPath = path.join(
  process.env.ProgramFiles,
  "ffmpeg",
  "bin",
  "ffmpeg.exe"
);

ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = ffmpeg;
