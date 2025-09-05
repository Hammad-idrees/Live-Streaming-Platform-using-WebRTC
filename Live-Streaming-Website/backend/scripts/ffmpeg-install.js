const { execSync } = require("child_process");

try {
  execSync("ffmpeg -version", { stdio: "ignore" });
  console.log("FFmpeg is already installed.");
} catch (err) {
  console.log("FFmpeg is not installed. Please install it:");
  console.log("- Windows: https://ffmpeg.org/download.html");
  console.log("- Mac: brew install ffmpeg");
  console.log("- Linux: sudo apt install ffmpeg");
}
