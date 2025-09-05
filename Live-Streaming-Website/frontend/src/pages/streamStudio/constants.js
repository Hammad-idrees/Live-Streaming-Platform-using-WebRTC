// Video resolution presets
export const VIDEO_RESOLUTIONS = {
  "240p": { width: 426, height: 240, label: "240p (Low)" },
  "360p": { width: 640, height: 360, label: "360p (Medium)" },
  "480p": { width: 854, height: 480, label: "480p (High)" },
  "720p": { width: 1280, height: 720, label: "720p (HD)" },
  "1080p": { width: 1920, height: 1080, label: "1080p (Full HD)" },
};

// Video quality presets with bitrate
export const VIDEO_QUALITY_PRESETS = {
  low: {
    resolution: VIDEO_RESOLUTIONS["360p"],
    frameRate: 15,
    bitRate: 500000, // 500 kbps
    label: "Low Quality (360p, 15fps)",
  },
  medium: {
    resolution: VIDEO_RESOLUTIONS["480p"],
    frameRate: 24,
    bitRate: 1000000, // 1 Mbps
    label: "Medium Quality (480p, 24fps)",
  },
  high: {
    resolution: VIDEO_RESOLUTIONS["720p"],
    frameRate: 30,
    bitRate: 2500000, // 2.5 Mbps
    label: "High Quality (720p, 30fps)",
  },
  ultra: {
    resolution: VIDEO_RESOLUTIONS["1080p"],
    frameRate: 30,
    bitRate: 5000000, // 5 Mbps
    label: "Ultra Quality (1080p, 30fps)",
  },
};

// Default audio constraints
export const DEFAULT_AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  sampleRate: { ideal: 48000 },
  channelCount: { ideal: 2 },
  volume: 1.0,
};
