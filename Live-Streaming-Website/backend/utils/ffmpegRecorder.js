const { spawn } = require("child_process");
const path = require("path");

// Start FFmpeg to record both video and audio RTP to an MP4 file
// video: { ip, port, ssrc }, audio: { ip, port, ssrc }
// Returns: { process, filePath }
function startRecording({ video, audio, outputDir = "./vods" }) {
  const fileName = `vod_${Date.now()}.mp4`;
  const filePath = path.join(outputDir, fileName);

  // FFmpeg command to receive both video and audio RTP and save to MP4
  const ffmpegArgs = [
    // Video input
    "-protocol_whitelist",
    "file,udp,rtp",
    "-f",
    "rtp",
    "-i",
    `rtp://${video.ip}:${video.port}`,
    // Audio input
    "-protocol_whitelist",
    "file,udp,rtp",
    "-f",
    "rtp",
    "-i",
    `rtp://${audio.ip}:${audio.port}`,
    // Map video and audio
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-strict",
    "experimental",
    "-f",
    "mp4",
    filePath,
  ];

  const ffmpeg = spawn("ffmpeg", ffmpegArgs, { stdio: "ignore" });

  ffmpeg.on("error", (err) => {
    console.error("FFmpeg error:", err);
  });

  ffmpeg.on("exit", (code, signal) => {
    if (code !== 0) {
      console.error(`FFmpeg exited with code ${code} (signal: ${signal})`);
    }
  });

  return { process: ffmpeg, filePath };
}

// Stop FFmpeg process
function stopRecording(recorder) {
  if (recorder && recorder.process) {
    recorder.process.kill("SIGINT");
  }
}

module.exports = { startRecording, stopRecording };
