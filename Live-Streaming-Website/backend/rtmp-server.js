const NodeMediaServer = require("node-media-server");
const rtmpConfig = require("./config/rtmp");

const config = {
  rtmp: {
    port: rtmpConfig.port,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: "*",
  },
};

const nms = new NodeMediaServer(config);

nms.on("prePublish", (id, StreamPath, args) => {
  // Placeholder: Authenticate stream key, etc.
  console.log(`[RTMP] prePublish: id=${id} StreamPath=${StreamPath}`);
});

nms.on("postPublish", (id, StreamPath, args) => {
  console.log(`[RTMP] postPublish: id=${id} StreamPath=${StreamPath}`);
});

nms.on("donePublish", (id, StreamPath, args) => {
  console.log(`[RTMP] donePublish: id=${id} StreamPath=${StreamPath}`);
});

nms.run();
console.log(`RTMP server running on port ${rtmpConfig.port}`);
