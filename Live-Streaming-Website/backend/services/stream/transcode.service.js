const { ffmpegPath, presets } = require("../../config/ffmpeg");
const { spawn } = require("child_process");

function transcodeStream(inputPath, outputPath) {
  // Placeholder: Use FFmpeg to transcode input to HLS or other formats
  const args = ["-i", inputPath, ...presets.hls, outputPath];
  const ffmpeg = spawn(ffmpegPath, args);
  ffmpeg.stdout.on("data", (data) => console.log(`FFmpeg: ${data}`));
  ffmpeg.stderr.on("data", (data) => console.error(`FFmpeg error: ${data}`));
  ffmpeg.on("close", (code) => console.log(`FFmpeg exited with code ${code}`));
  return ffmpeg;
}

module.exports = { transcodeStream };
