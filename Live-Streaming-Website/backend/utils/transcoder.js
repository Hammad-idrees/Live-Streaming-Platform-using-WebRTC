const { spawn } = require("child_process");
const config = require("../config/ffmpeg");
const fs = require("fs");
const path = require("path");

function transcodeToHls(inputPath, outputDir, latencyMode = "standardLatency") {
  // outputDir: directory to store HLS files
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const renditions = config.presets.hls[latencyMode];
  const playlistFiles = [];
  const processes = renditions.map((args, i) => {
    const quality = ["1080p", "720p", "480p"][i];
    const playlist = path.join(outputDir, `${quality}.m3u8`);
    playlistFiles.push({ quality, playlist });
    const fullArgs = ["-i", inputPath, ...args, playlist];
    const ffmpeg = spawn(config.ffmpegPath, fullArgs);
    ffmpeg.stdout.on("data", (data) =>
      console.log(`FFmpeg [${quality}]: ${data}`)
    );
    ffmpeg.stderr.on("data", (data) =>
      console.error(`FFmpeg error [${quality}]: ${data}`)
    );
    ffmpeg.on("close", (code) =>
      console.log(`FFmpeg [${quality}] exited with code ${code}`)
    );
    return ffmpeg;
  });
  // After all renditions, generate master playlist
  generateMasterPlaylist(
    outputDir,
    playlistFiles.map((f) => f.quality)
  );
  return processes;
}

function generateMasterPlaylist(outputDir, qualities) {
  const lines = ["#EXTM3U"];
  if (qualities.includes("1080p")) {
    lines.push(
      "#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080",
      "1080p.m3u8"
    );
  }
  if (qualities.includes("720p")) {
    lines.push(
      "#EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720",
      "720p.m3u8"
    );
  }
  if (qualities.includes("480p")) {
    lines.push(
      "#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=854x480",
      "480p.m3u8"
    );
  }
  fs.writeFileSync(path.join(outputDir, "master.m3u8"), lines.join("\n"));
}

module.exports = { transcodeToHls, generateMasterPlaylist };
