// services/frameAnalysis.js
const { analyzeImage } = require("./pythonService");
const config = require("../config/videoProcessing");

async function analyzeVideoFrames(framePaths, videoId) {
  const results = {
    detectedObjects: new Set(),
    frameAnalysis: [],
    tagCounts: new Map(),
    processingStats: {
      framesProcessed: 0,
      totalDetections: 0,
    },
  };

  // Process frames in batches
  const batchSize = 3;
  for (let i = 0; i < framePaths.length; i += batchSize) {
    const batch = framePaths.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((framePath, idx) =>
        processSingleFrame(framePath, i + idx + 1, videoId)
      )
    );

    batchResults.forEach((result) => {
      if (result.objects.length > 0) {
        result.objects.forEach((obj) => {
          results.detectedObjects.add(obj);
          results.tagCounts.set(obj, (results.tagCounts.get(obj) || 0) + 1);
        });
        results.processingStats.totalDetections += result.objects.length;

        results.frameAnalysis.push({
          frameNumber: result.frameNumber,
          timestamp: result.timestamp,
          objects: result.objects,
        });
      }
      results.processingStats.framesProcessed++;
    });
  }

  return {
    uniqueTags: Array.from(results.detectedObjects),
    tagCounts: Object.fromEntries(results.tagCounts),
    frameAnalysis: results.frameAnalysis,
    stats: results.processingStats,
  };
}

async function processSingleFrame(framePath, frameNumber, videoId) {
  try {
    const objects = await analyzeImage(framePath);
    return {
      frameNumber,
      timestamp: `${(
        (frameNumber - 1) *
        (1 / config.frameSampling.fps)
      ).toFixed(2)}s`,
      objects: objects.filter((o) => o.confidence >= config.minConfidence),
    };
  } catch (error) {
    console.error(`Analysis failed for frame ${frameNumber}:`, error);
    return { frameNumber, timestamp: "0s", objects: [] };
  }
}

module.exports = { analyzeVideoFrames };
