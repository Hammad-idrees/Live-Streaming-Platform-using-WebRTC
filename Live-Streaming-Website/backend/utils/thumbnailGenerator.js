const { spawn } = require("child_process");
const path = require("path");

async function generateThumbnail(videoPath, outputDir = "./vods") {
  const thumbName = `thumb_${Date.now()}.jpg`;
  const thumbPath = path.join(outputDir, thumbName);
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-ss",
      "2", // seek to 2 seconds
      "-i",
      videoPath,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      thumbPath,
    ]);
    ffmpeg.on("error", (err) => reject(err));
    ffmpeg.on("exit", (code) => {
      if (code === 0) resolve(thumbPath);
      else reject(new Error("FFmpeg thumbnail generation failed"));
    });
  });
}

module.exports = { generateThumbnail };
