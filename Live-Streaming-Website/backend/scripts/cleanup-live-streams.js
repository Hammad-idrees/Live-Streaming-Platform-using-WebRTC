require("dotenv").config();
const mongoose = require("mongoose");
const config = require("../config/env");
const Stream = require("../models/Stream");

async function cleanupLiveStreams() {
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const result = await Stream.updateMany(
    { isLive: true },
    { $set: { isLive: false, status: "ended", endedAt: new Date() } }
  );
  console.log(`Updated ${result.modifiedCount} streams.`);
  await mongoose.disconnect();
}

cleanupLiveStreams().catch((err) => {
  console.error(err);
  process.exit(1);
});
