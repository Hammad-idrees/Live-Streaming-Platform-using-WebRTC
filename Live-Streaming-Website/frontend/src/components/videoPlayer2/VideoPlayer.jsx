// components/VideoPlayer.jsx
import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src, resolutions }) => {
  const videoRef = useRef(null);
  const [currentResolution, setCurrentResolution] = useState("auto");
  const [hls, setHls] = useState(null);
  const [qualityLevels, setQualityLevels] = useState([]);

  useEffect(() => {
    if (!src) return;

    const initPlayer = () => {
      if (Hls.isSupported()) {
        const newHls = new Hls({
          maxMaxBufferLength: 60,
          enableWorker: true,
        });

        newHls.loadSource(src);
        newHls.attachMedia(videoRef.current);

        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = newHls.levels.map((level, index) => ({
            id: index,
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            name: resolutions[index] || `${level.height}p`,
          }));

          setQualityLevels(levels);
          setCurrentResolution("auto");
        });

        setHls(newHls);
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        // Native HLS support (Safari)
        videoRef.current.src = src;
      }
    };

    initPlayer();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  const changeQuality = (levelIndex) => {
    if (hls && levelIndex !== "auto") {
      hls.currentLevel = levelIndex;
      setCurrentResolution(levelIndex);
    } else if (hls) {
      hls.currentLevel = -1; // Auto
      setCurrentResolution("auto");
    }
  };

  return (
    <div className="relative w-full">
      <video ref={videoRef} controls className="w-full bg-black" />

      {qualityLevels.length > 0 && (
        <div className="absolute bottom-12 right-4 bg-black/70 rounded-lg p-2 z-10">
          <select
            value={currentResolution}
            onChange={(e) => changeQuality(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            <option value="auto">Auto</option>
            {qualityLevels.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name} ({Math.round(level.bitrate / 1000)}kbps)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
