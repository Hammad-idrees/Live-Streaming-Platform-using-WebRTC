// const multer = require("multer");
// const ffmpeg = require("fluent-ffmpeg");
// const fs = require("fs-extra");
// const path = require("path");
// const Vod = require("../models/Vod");

// // Set up upload directory
// const uploadDir = path.join(__dirname, "..", "uploads");
// fs.ensureDirSync(uploadDir);

// const storage = multer.diskStorage({
//   destination: uploadDir,
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.random()
//       .toString(36)
//       .substring(2, 9)}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
//   fileFilter: (req, file, cb) => {
//     const validMimeTypes = [
//       "video/mp4",
//       "video/quicktime",
//       "video/x-msvideo",
//       "video/x-matroska",
//     ];
//     validMimeTypes.includes(file.mimetype)
//       ? cb(null, true)
//       : cb(
//           new Error("Invalid file type. Only video files are allowed."),
//           false
//         );
//   },
// });

// const uploadAndConvert = async (req, res) => {
//   if (!req.body.title) {
//     return res.status(400).json({ success: false, error: "Title is required" });
//   }

//   let outputDir;
//   let inputPath = req.file?.path;

//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: "No file uploaded",
//       });
//     }

//     const fileName = path.parse(req.file.filename).name;
//     outputDir = path.join(__dirname, "..", "videos", fileName);
//     const hlsPath = `/videos/${fileName}/index.m3u8`;

//     // Create output directory
//     await fs.ensureDir(outputDir);

//     // Generate thumbnail
//     const thumbnailPath = path.join(outputDir, "thumbnail.jpg");
//     await new Promise((resolve, reject) => {
//       ffmpeg(inputPath)
//         .screenshots({
//           count: 1,
//           timestamps: ["50%"],
//           folder: outputDir,
//           filename: "thumbnail.jpg",
//           size: "640x360",
//         })
//         .on("end", resolve)
//         .on("error", reject);
//     });

//     // Convert to HLS (single quality)
//     await new Promise((resolve, reject) => {
//       ffmpeg(inputPath)
//         .outputOptions([
//           "-c:v libx264",
//           "-c:a aac",
//           "-hls_time 6",
//           "-hls_list_size 0",
//           "-start_number 0",
//         ])
//         .output(path.join(outputDir, "index.m3u8"))
//         .on("end", resolve)
//         .on("error", reject)
//         .run();
//     });

//     // Create database entry
//     const vod = await Vod.create({
//       title: req.body.title,
//       description: req.body.description || "",
//       user: req.user.id,
//       url: hlsPath,
//       thumbnail: `/videos/${fileName}/thumbnail.jpg`,
//       originalFileName: req.file.originalname,
//       fileSize: req.file.size,
//       category: req.body.category || "uncategorized",
//     });

//     // Cleanup original file
//     await fs.unlink(inputPath);

//     res.status(201).json({
//       success: true,
//       data: {
//         hlsUrl: hlsPath,
//         thumbnail: vod.thumbnail,
//         vodId: vod._id,
//       },
//     });
//   } catch (err) {
//     console.error("Upload error:", err);

//     // Cleanup
//     if (inputPath) await fs.remove(inputPath).catch(console.error);
//     if (outputDir) await fs.remove(outputDir).catch(console.error);

//     res.status(500).json({
//       success: false,
//       error: "Video processing failed",
//       details: process.env.NODE_ENV === "development" ? err.message : undefined,
//     });
//   }
// };

// module.exports = {
//   upload,
//   uploadAndConvert,
// };
// controllers/upload.controller.js
// controllers/upload.controller.js - FIXED VERSION
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const path = require("path");
const Vod = require("../models/Vod");
const { analyzeImage } = require("../services/pythonService");

// Configure upload settings
const configureUpload = () => {
  const uploadDir = path.join(__dirname, "..", "videos");
  fs.ensureDirSync(uploadDir);

  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  return multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const validMimeTypes = [
        "video/mp4",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-matroska",
        "video/webm",
        "video/avi",
      ];
      validMimeTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(
            new Error("Invalid file type. Only video files are allowed."),
            false
          );
    },
  });
};

const upload = configureUpload();

// Helper function to extract frames with better error handling
const extractFrames = (inputPath, outputDir, fileName) => {
  return new Promise((resolve, reject) => {
    const tempFramesDir = path.join(outputDir, "temp_frames");

    // Ensure temp directory exists
    fs.ensureDirSync(tempFramesDir);

    const framePaths = [];

    console.log(`🎬 Extracting frames from: ${inputPath}`);

    ffmpeg(inputPath)
      .on("start", (commandLine) => {
        console.log("📹 FFmpeg command:", commandLine);
      })
      .on("filenames", (filenames) => {
        console.log("📸 Generated frame files:", filenames);
        filenames.forEach((name) => {
          framePaths.push(path.join(tempFramesDir, name));
        });
      })
      .on("end", () => {
        console.log(
          `✅ Frame extraction completed. Generated ${framePaths.length} frames`
        );
        resolve({ framePaths, tempFramesDir });
      })
      .on("error", (err) => {
        console.error("❌ Frame extraction failed:", err);
        reject(new Error(`Frame extraction failed: ${err.message}`));
      })
      .screenshots({
        count: 5, // Extract 5 frames for better analysis
        folder: tempFramesDir,
        filename: `${fileName}-frame-%i.png`,
        timemarks: ["10%", "25%", "50%", "75%", "90%"], // Better time distribution
        size: "640x360",
      });
  });
};

// Helper function to analyze frames with better error handling
const analyzeFrames = async (framePaths) => {
  const allTags = [];
  const frameAnalysis = [];

  console.log(`🔍 Starting AI analysis of ${framePaths.length} frames...`);

  for (let i = 0; i < framePaths.length; i++) {
    const framePath = framePaths[i];

    try {
      // Check if frame file exists
      if (!(await fs.pathExists(framePath))) {
        console.warn(`⚠️ Frame file not found: ${framePath}`);
        continue;
      }

      console.log(
        `🤖 Analyzing frame ${i + 1}/${framePaths.length}: ${path.basename(
          framePath
        )}`
      );

      const tags = await analyzeImage(framePath);

      console.log(`📋 Frame ${i + 1} detected objects:`, tags);

      if (tags && tags.length > 0) {
        allTags.push(...tags);
        frameAnalysis.push({
          frameIndex: i + 1,
          detectedObjects: tags,
          confidence: 1.0, // You can modify Python script to return confidence scores
        });
      }

      // Clean up frame file after analysis
      await fs.unlink(framePath);
    } catch (err) {
      console.error(`❌ Error analyzing frame ${framePath}:`, err);
      // Try to clean up even if analysis failed
      try {
        await fs.unlink(framePath);
      } catch (cleanupErr) {
        console.error(`❌ Failed to cleanup frame: ${cleanupErr.message}`);
      }
    }
  }

  // Get unique tags with count
  const tagCounts = {};
  allTags.forEach((tag) => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const uniqueTags = [...new Set(allTags)];

  console.log(`🏷️ AI Analysis Summary:`);
  console.log(`   - Total objects detected: ${allTags.length}`);
  console.log(`   - Unique objects: ${uniqueTags.length}`);
  console.log(`   - Tag frequency:`, tagCounts);

  return {
    uniqueTags,
    tagCounts,
    frameAnalysis,
    totalObjects: allTags.length,
  };
};

const uploadAndConvert = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ success: false, error: "Title is required" });
  }

  let outputDir;
  let inputPath = req.file?.path;
  let tempFramesDir;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    console.log(`🚀 Processing video upload: ${req.file.originalname}`);
    console.log(`📁 Input file: ${inputPath}`);
    console.log(`📊 File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    const fileName = path.parse(req.file.filename).name;
    outputDir = path.join(__dirname, "..", "videos", fileName);
    const hlsPath = `/videos/${fileName}/index.m3u8`;

    await fs.ensureDir(outputDir);

    // Generate thumbnail
    console.log("🖼️ Generating thumbnail...");
    const thumbnailPath = path.join(outputDir, "thumbnail.jpg");
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .screenshots({
          count: 1,
          timestamps: ["50%"],
          folder: outputDir,
          filename: "thumbnail.jpg",
          size: "640x360",
        })
        .on("end", () => {
          console.log("✅ Thumbnail generated successfully");
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ Thumbnail generation failed:", err);
          reject(err);
        });
    });

    // Extract frames for object detection
    console.log("🎬 Extracting frames for AI analysis...");
    const { framePaths, tempFramesDir: tempDir } = await extractFrames(
      inputPath,
      outputDir,
      fileName
    );
    tempFramesDir = tempDir;

    // Analyze frames with AI
    const aiAnalysisResult = await analyzeFrames(framePaths);

    // Clean up temp frames directory
    if (tempFramesDir && (await fs.pathExists(tempFramesDir))) {
      await fs.remove(tempFramesDir);
      console.log("🧹 Cleaned up temporary frames directory");
    }

    // Convert to HLS
    console.log("🔄 Converting to HLS format...");
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-c:v libx264",
          "-c:a aac",
          "-hls_time 6",
          "-hls_list_size 0",
          "-start_number 0",
          "-preset fast", // Faster encoding
          "-crf 23", // Good quality balance
        ])
        .output(path.join(outputDir, "index.m3u8"))
        .on("start", (commandLine) => {
          console.log("🎥 HLS conversion started:", commandLine);
        })
        .on("progress", (progress) => {
          if (progress.percent) {
            console.log(
              `📈 HLS conversion progress: ${Math.round(progress.percent)}%`
            );
          }
        })
        .on("end", () => {
          console.log("✅ HLS conversion completed");
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ HLS conversion failed:", err);
          reject(err);
        })
        .run();
    });

    const {
      uploadDirectoryToS3,
      uploadFileToS3,
    } = require("../utils/s3Uploader");

    // After HLS conversion & thumbnail generation
    const s3BaseKey = `videos/${fileName}`;
    await uploadDirectoryToS3(outputDir, s3BaseKey);

    // Get S3 URLs
    const getS3Url = (key) =>
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const hlsUrl = getS3Url(`${s3BaseKey}/index.m3u8`);
    const thumbnailUrl = getS3Url(`${s3BaseKey}/thumbnail.jpg`);

    // Transform AI analysis data to match schema
    const transformAiAnalysis = (aiData) => {
      const transformed = {
        objects: [],
        tagCounts: new Map(),
        frameAnalysis: [],
        sceneType: aiData.sceneType || "",
        dominantColors: aiData.dominantColors || [],
        isSensitive: aiData.isSensitive || false,
        totalObjectsDetected: 0,
        framesAnalyzed: 0,
        processingDate: new Date(),
      };

      // Transform objects array from strings to objects
      if (aiData.objects && Array.isArray(aiData.objects)) {
        transformed.objects = aiData.objects
          .map((obj) => {
            // If it's already an object, use it
            if (typeof obj === "object" && obj.name) {
              return {
                name: obj.name,
                confidence: obj.confidence || 0.8,
                timestamps: obj.timestamps || [],
              };
            }
            // If it's a string, convert to object
            else if (typeof obj === "string") {
              return {
                name: obj,
                confidence: 0.8, // default confidence
                timestamps: [], // empty timestamps array
              };
            }
            return null;
          })
          .filter(Boolean); // Remove null values

        transformed.totalObjectsDetected = transformed.objects.length;
      }

      // Transform frame analysis if needed
      if (aiData.frameAnalysis && Array.isArray(aiData.frameAnalysis)) {
        transformed.frameAnalysis = aiData.frameAnalysis.map((frame) => ({
          frameIndex: frame.frameIndex || 0,
          detectedObjects: Array.isArray(frame.detectedObjects)
            ? frame.detectedObjects
            : [],
          confidence: frame.confidence || 1.0,
          timestamp: frame.timestamp || "0:00",
        }));
        transformed.framesAnalyzed = transformed.frameAnalysis.length;
      }

      // Create tag counts map
      transformed.objects.forEach((obj) => {
        const count = transformed.tagCounts.get(obj.name) || 0;
        transformed.tagCounts.set(obj.name, count + 1);
      });

      return transformed;
    };

    // Create database entry with properly formatted AI analysis
    console.log("💾 Saving video metadata to database...");
    const vod = await Vod.create({
      title: req.body.title,
      description: req.body.description || "",
      user: req.user.id,
      url: hlsPath,
      thumbnail: `/videos/${fileName}/thumbnail.jpg`,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      category: req.body.category || "uncategorized",
      aiTags: aiAnalysisResult.uniqueTags,
      aiAnalysis: transformAiAnalysis({
        ...aiAnalysisResult,
        objects: aiAnalysisResult.uniqueTags, // Use the unique tags as objects initially
        frameAnalysis: aiAnalysisResult.frameAnalysis,
      }),
      processingStatus: "completed",
    });

    // Clean up original uploaded file
    await fs.unlink(inputPath);
    console.log("🧹 Cleaned up original uploaded file");

    console.log("🎉 Video processing completed successfully!");
    console.log(
      `📋 Detected AI tags: ${aiAnalysisResult.uniqueTags.join(", ")}`
    );

    res.status(201).json({
      success: true,
      data: {
        hlsUrl: hlsPath,
        thumbnail: vod.thumbnail,
        vodId: vod._id,
        detectedTags: vod.aiTags,
        aiAnalysis: vod.aiAnalysis,
        processingStats: {
          framesAnalyzed: aiAnalysisResult.frameAnalysis.length,
          totalObjects: aiAnalysisResult.totalObjects,
          uniqueObjects: aiAnalysisResult.uniqueTags.length,
        },
      },
    });
  } catch (err) {
    console.error("💥 Upload processing error:", err);

    // Comprehensive cleanup
    const cleanupTasks = [];

    if (inputPath && (await fs.pathExists(inputPath))) {
      cleanupTasks.push(fs.remove(inputPath));
    }

    if (outputDir && (await fs.pathExists(outputDir))) {
      cleanupTasks.push(fs.remove(outputDir));
    }

    if (tempFramesDir && (await fs.pathExists(tempFramesDir))) {
      cleanupTasks.push(fs.remove(tempFramesDir));
    }

    await Promise.allSettled(cleanupTasks);

    res.status(500).json({
      success: false,
      error: "Video processing failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  upload,
  uploadAndConvert,
};
