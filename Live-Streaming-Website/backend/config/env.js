// env.js
require("dotenv").config();

const config = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/livestream",
  redisURI: process.env.REDIS_URI || "redis://localhost:6379",
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET,
  },
  rtmp: {
    host: process.env.RTMP_HOST || "localhost",
    port: process.env.RTMP_PORT || 1935,
  },
  ffmpegPath: process.env.FFMPEG_PATH || "ffmpeg",
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = config;
