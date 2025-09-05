// utils/frameExtractor.js
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs-extra");

const DEFAULT_CONFIG = {
  strategy: "fps", // 'fps' | 'total-frames' | 'keyframes'
  fps: 1, // Frames per second (for 'fps' strategy)
  totalFrames: 5, // Total frames to extract (for 'total-frames')
  maxFrames: 30, // Safety limit
  resolution: "640x360",
  minConfidence: 0.4,
};

async function extractFrames(videoPath, outputDir, videoId, userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const tempDir = path.join(outputDir, "temp_frames");
  await fs.ensureDir(tempDir);

  // Get video duration
  const duration = await getVideoDuration(videoPath);
  const frameCount = calculateFrameCount(duration, config);

  // Build FFmpeg command
  const cmd = ffmpeg(videoPath)
    .outputOptions(getFfmpegOptions(config, duration))
    .output(path.join(tempDir, `${videoId}-frame-%03d.png`));

  // Execute extraction
  const framePaths = await executeExtraction(
    cmd,
    tempDir,
    videoId,
    config.maxFrames
  );

  return {
    framePaths,
    tempFramesDir: tempDir,
    configUsed: config,
    videoDuration: duration,
  };
}

// Helper functions
async function getVideoDuration(videoPath) {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      resolve(err ? 0 : metadata.format.duration || 0);
    });
  });
}

function calculateFrameCount(duration, config) {
  if (config.strategy === "fps") {
    return Math.min(Math.ceil(duration * config.fps), config.maxFrames);
  } else if (config.strategy === "total-frames") {
    return Math.min(config.totalFrames, config.maxFrames);
  }
  return config.maxFrames;
}

function getFfmpegOptions(config, duration) {
  const options = [
    `-vf scale=${config.resolution}`,
    config.strategy === "keyframes" ? "-skip_frame nokey" : null,
  ].filter(Boolean);

  if (config.strategy === "fps") {
    options.push(`-vf fps=${config.fps}`);
  } else if (config.strategy === "total-frames") {
    const interval = duration / config.totalFrames;
    options.push(`-vf fps=1/${interval.toFixed(2)}`);
  }

  return options;
}

async function executeExtraction(cmd, tempDir, videoId, maxFrames) {
  return new Promise((resolve, reject) => {
    cmd
      .on("end", async () => {
        const files = (await fs.readdir(tempDir))
          .filter((f) => f.includes(`${videoId}-frame-`))
          .sort()
          .slice(0, maxFrames);
        resolve(files.map((f) => path.join(tempDir, f)));
      })
      .on("error", reject)
      .run();
  });
}

module.exports = { extractFrames };
