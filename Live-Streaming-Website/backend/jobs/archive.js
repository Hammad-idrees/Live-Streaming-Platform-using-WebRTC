const archiveService = require("../services/stream/archive.service");
const Stream = require("../models/Stream");

async function archiveFinishedStreams() {
  // Find streams that ended but not archived
  const endedStreams = await Stream.find({
    status: "ended",
    archived: { $ne: true },
  });
  for (const stream of endedStreams) {
    // Placeholder: Generate VOD URL, thumbnail, duration
    const vodUrl = `s3://vods/${stream._id}.m3u8`;
    const thumbnail = "";
    const duration = 0;
    await archiveService.archiveStream(stream._id, vodUrl, thumbnail, duration);
    stream.archived = true;
    await stream.save();
  }
}

// Placeholder: Schedule with node-cron or similar
// const cron = require('node-cron');
// cron.schedule('0 * * * *', archiveFinishedStreams);

module.exports = { archiveFinishedStreams };
