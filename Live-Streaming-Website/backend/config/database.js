// database.js
const mongoose = require("mongoose");
//const Redis = require("ioredis");
const config = require("./env");

// MongoDB connection
const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Redis connection
//const redis = new Redis(config.redisURI);

module.exports = {
  connectMongo,
  //redis,
};
