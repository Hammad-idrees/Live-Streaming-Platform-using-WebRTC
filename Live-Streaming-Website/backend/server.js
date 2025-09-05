require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectMongo, redis } = require("./config/database");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");
const { initSocket } = require("./utils/socketManager");
const s3 = require("./config/aws");
const config = require("./config/env");
const path = require("path");
const fs = require("fs-extra");

const app = express();
const server = http.createServer(app);

// Serve uploads directory for avatars and other static files
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://172.17.180.64:3001");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(__dirname + "/uploads")
);

app.use(
  "/upload2",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://172.17.180.64:3001");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  },
  express.static(__dirname + "/upload2")
);

app.use(
  "/videos",
  (req, res, next) => {
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "http://172.17.180.64:3001");
    res.header("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");

    // Set content-type headers for HLS
    const filePath = path.join(__dirname, "videos", req.path);
    if (filePath.endsWith(".m3u8")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    } else if (filePath.endsWith(".ts")) {
      res.setHeader("Content-Type", "video/MP2T");
    }

    next();
  },
  express.static(path.join(__dirname, "videos"))
);
fs.ensureDirSync(path.join(__dirname, "videos"));
// Middleware
const allowedOrigins = ["http://localhost:3001", "http://172.17.180.64:3001"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use("/", routes);

// ── Add this TURN endpoint for ICE configuration ──
//app.use("/turn", require("./routes/turn"));

// Error handler
app.use(errorHandler);

// Connect to DB, then start server
connectMongo().then(() => {
  // Initialize Socket.IO
  initSocket(server);

  const PORT = process.env.PORT || 7001;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`HTTP server running on port ${PORT}`);
  });
});

// Redis connection test
// redis
//   .set("test_key", "test_value", "EX", 10)
//   .then(() => redis.get("test_key"))
//   .then((value) => {
//     console.log("Redis test value:", value); // Should print: test_value
//   })
//   .catch((err) => {
//     console.error("Redis connection error:", err);
//   });

s3.listObjectsV2({ Bucket: config.aws.bucket, MaxKeys: 1 }, (err, data) => {
  if (err) {
    console.error("AWS S3 connection error:", err.message);
  } else {
    console.log("AWS S3 is working. Bucket contents:", data.Contents);
  }
});
