const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const path = require("path");

const RESOLUTIONS = [
  { name: "360p", width: 640, height: 360, bitrate: "800k" },
  { name: "480p", width: 854, height: 480, bitrate: "1200k" },
  { name: "720p", width: 1280, height: 720, bitrate: "2500k" },
];

async function generateHLS(inputPath, outputDir) {
  try {
    await fs.ensureDir(outputDir);

    const variantPromises = RESOLUTIONS.map((res) => {
      return new Promise((resolve, reject) => {
        const outputPath = path.join(outputDir, `${res.name}.m3u8`);
        const segmentPattern = path
          .join(outputDir, `${res.name}_%03d.ts`)
          .replace(/\\/g, "/");

        const command = ffmpeg(inputPath)
          .videoCodec("libx264")
          .audioCodec("aac")
          .size(`${res.width}x${res.height}`)
          .outputOptions(
            "-preset veryfast",
            "-g 48",
            "-sc_threshold 0",
            `-b:v ${res.bitrate}`,
            `-maxrate ${res.bitrate}`,
            "-bufsize 1200k",
            "-hls_time 6",
            "-hls_list_size 0",
            "-start_number 0",
            `-hls_segment_filename ${segmentPattern}`
          )
          .output(outputPath)
          .on("end", () => {
            console.log(`${res.name} stream generated`);
            resolve();
          })
          .on("error", (err) => {
            console.error(`Error generating ${res.name} stream:`, err);
            reject(err);
          });

        command.run();
      });
    });

    await Promise.all(variantPromises);

    // Create master playlist
    let masterPlaylist = "#EXTM3U\n";
    RESOLUTIONS.forEach((res) => {
      masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${
        parseInt(res.bitrate) * 1000
      },RESOLUTION=${res.width}x${res.height}\n`;
      masterPlaylist += `${res.name}.m3u8\n`;
    });

    await fs.writeFile(path.join(outputDir, "index.m3u8"), masterPlaylist);
    console.log("✅ Master playlist generated");

    return true;
  } catch (err) {
    console.error("❌ HLS generation error:", err);
    throw err;
  }
}

module.exports = generateHLS;
