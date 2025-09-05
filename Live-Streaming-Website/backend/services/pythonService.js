const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs-extra");

const analyzeImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    console.log(`🐍 Starting Python analysis for: ${imagePath}`);

    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`);
      return reject(new Error(`Image file not found: ${imagePath}`));
    }

    // Check if Python script exists
    const scriptPath = path.join(__dirname, "../python/detector.py");
    if (!fs.existsSync(scriptPath)) {
      console.error(`❌ Python script not found: ${scriptPath}`);
      return reject(new Error(`Python script not found: ${scriptPath}`));
    }

    const python = spawn("python", [scriptPath, imagePath], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PYTHONPATH: path.dirname(scriptPath) },
    });

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(`🐍 Python stdout: ${chunk.trim()}`);
    });

    python.stderr.on("data", (data) => {
      const chunk = data.toString();
      errorOutput += chunk;
      console.error(`🐍 Python stderr: ${chunk.trim()}`);
    });

    python.on("close", (code) => {
      console.log(`🐍 Python process exited with code: ${code}`);

      if (code !== 0) {
        console.error(`❌ Python script failed with code ${code}`);
        console.error(`❌ Error output: ${errorOutput}`);
        return reject(
          new Error(`Python script failed with code ${code}: ${errorOutput}`)
        );
      }

      try {
        // Clean and parse JSON output
        const cleanOutput = output.trim();
        console.log(`📊 Raw Python output: ${cleanOutput}`);

        if (!cleanOutput) {
          console.warn("⚠️ Empty output from Python script");
          return resolve([]);
        }

        const results = JSON.parse(cleanOutput);
        console.log(`✅ Parsed results: ${JSON.stringify(results)}`);
        resolve(results);
      } catch (parseErr) {
        console.error(`❌ Failed to parse Python output: ${parseErr.message}`);
        console.error(`❌ Raw output was: ${output}`);
        reject(new Error(`Failed to parse Python output: ${parseErr.message}`));
      }
    });

    python.on("error", (spawnErr) => {
      console.error(`❌ Failed to spawn Python process: ${spawnErr.message}`);
      reject(new Error(`Failed to spawn Python process: ${spawnErr.message}`));
    });

    // Set timeout to prevent hanging
    setTimeout(() => {
      if (!python.killed) {
        python.kill();
        reject(new Error("Python process timeout"));
      }
    }, 30000); // 30 second timeout
  });
};

module.exports = { analyzeImage };
