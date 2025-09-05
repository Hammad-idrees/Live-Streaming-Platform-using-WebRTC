import { useState, useCallback } from "react";
import { VIDEO_RESOLUTIONS, VIDEO_QUALITY_PRESETS } from "./constants";

export const useVideoManager = (
  selectedCameraId,
  streaming,
  pcRef,
  streamRef,
  localVideoRef,
  getAudioConstraints,
  handleAudioError,
  startAudioMonitoring,
  stopAudioMonitoring
) => {
  const [selectedResolution, setSelectedResolution] = useState("720p");
  const [selectedQualityPreset, setSelectedQualityPreset] = useState("medium");
  const [customFrameRate, setCustomFrameRate] = useState(30);
  const [customBitRate, setCustomBitRate] = useState(2500000);
  const [showVideoSettings, setShowVideoSettings] = useState(false);

  // Get current video constraints based on selected settings
  const getVideoConstraints = useCallback(() => {
    const resolution = VIDEO_RESOLUTIONS[selectedResolution];
    const qualityPreset = VIDEO_QUALITY_PRESETS[selectedQualityPreset];

    return {
      deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
      width: { ideal: resolution.width },
      height: { ideal: resolution.height },
      frameRate: { ideal: qualityPreset.frameRate || customFrameRate },
      facingMode: "user",
    };
  }, [
    selectedCameraId,
    selectedResolution,
    selectedQualityPreset,
    customFrameRate,
  ]);

  // Apply video quality settings to peer connection
  const applyVideoQuality = useCallback(async () => {
    if (!pcRef.current || !streamRef.current) return;

    try {
      const sender = pcRef.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender && sender.getParameters) {
        const params = sender.getParameters();
        const qualityPreset = VIDEO_QUALITY_PRESETS[selectedQualityPreset];

        if (params.encodings && params.encodings.length > 0) {
          params.encodings[0].maxBitrate =
            qualityPreset.bitRate || customBitRate;
          params.encodings[0].maxFramerate =
            qualityPreset.frameRate || customFrameRate;

          await sender.setParameters(params);
          console.log("📺 Video quality applied:", {
            maxBitrate: params.encodings[0].maxBitrate,
            maxFramerate: params.encodings[0].maxFramerate,
          });
        }
      }
    } catch (error) {
      console.error("Error applying video quality:", error);
    }
  }, [pcRef, selectedQualityPreset, customBitRate, customFrameRate]);

  // Handle resolution change with proper audio handling
  const handleResolutionChange = useCallback(
    async (newResolution) => {
      setSelectedResolution(newResolution);

      if (streaming && streamRef.current) {
        try {
          // Get new constraints with proper audio settings
          const videoConstraints = {
            ...getVideoConstraints(),
            width: { ideal: VIDEO_RESOLUTIONS[newResolution].width },
            height: { ideal: VIDEO_RESOLUTIONS[newResolution].height },
          };

          const audioConstraints = getAudioConstraints();

          const newStream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: audioConstraints,
          });

          console.log("🔍 New stream tracks:", {
            video: newStream.getVideoTracks().length,
            audio: newStream.getAudioTracks().length,
          });

          // Replace both video AND audio tracks
          const videoTrack = newStream.getVideoTracks()[0];
          const audioTrack = newStream.getAudioTracks()[0];

          const videoSender = pcRef.current
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");
          const audioSender = pcRef.current
            .getSenders()
            .find((s) => s.track && s.track.kind === "audio");

          if (videoSender && videoTrack) {
            await videoSender.replaceTrack(videoTrack);
            console.log("📺 Video track replaced");
          }

          if (audioSender && audioTrack) {
            await audioSender.replaceTrack(audioTrack);
            console.log("🎤 Audio track replaced");
          }

          // Update local video preview
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = newStream;
          }

          // Stop old stream tracks
          streamRef.current.getTracks().forEach((track) => track.stop());

          // Update stream reference
          streamRef.current = newStream;

          // Restart audio monitoring
          stopAudioMonitoring();
          setTimeout(startAudioMonitoring, 100);

          console.log(`📺🎤 Resolution and audio updated to ${newResolution}`);
        } catch (error) {
          console.error("Error changing resolution:", error);
          handleAudioError(error);
        }
      }
    },
    [
      streaming,
      getVideoConstraints,
      getAudioConstraints,
      pcRef,
      handleAudioError,
      startAudioMonitoring,
      stopAudioMonitoring,
    ]
  );

  // Handle quality preset change
  const handleQualityPresetChange = useCallback(
    (preset) => {
      setSelectedQualityPreset(preset);
      const presetConfig = VIDEO_QUALITY_PRESETS[preset];
      setCustomFrameRate(presetConfig.frameRate);
      setCustomBitRate(presetConfig.bitRate);

      // Apply quality settings if streaming
      if (streaming) {
        setTimeout(() => {
          applyVideoQuality();
        }, 100);
      }
    },
    [streaming, applyVideoQuality]
  );

  return {
    // State
    selectedResolution,
    selectedQualityPreset,
    customFrameRate,
    customBitRate,
    showVideoSettings,

    // Setters
    setSelectedResolution,
    setSelectedQualityPreset,
    setCustomFrameRate,
    setCustomBitRate,
    setShowVideoSettings,

    // Functions
    getVideoConstraints,
    applyVideoQuality,
    handleResolutionChange,
    handleQualityPresetChange,
  };
};
