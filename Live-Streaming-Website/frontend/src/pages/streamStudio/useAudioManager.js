import { useRef, useState, useCallback, useEffect } from "react";
import { DEFAULT_AUDIO_CONSTRAINTS } from "./constants";

export const useAudioManager = (selectedMicId, streaming, pcRef, streamRef) => {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const [audioLevel, setAudioLevel] = useState(0);
  const [audioError, setAudioError] = useState(null);

  // Get audio constraints with enhanced settings
  const getAudioConstraints = useCallback(() => {
    return {
      ...DEFAULT_AUDIO_CONSTRAINTS,
      deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
    };
  }, [selectedMicId]);

  // Check audio permissions
  const checkAudioPermissions = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: "microphone" });
      console.log("🎤 Microphone permission:", result.state);

      if (result.state === "denied") {
        setAudioError(
          "Microphone permission denied. Please allow microphone access."
        );
        return false;
      }

      setAudioError(null);
      return result.state === "granted";
    } catch (error) {
      console.error("Error checking audio permissions:", error);
      return false;
    }
  }, []);

  // Handle audio errors
  const handleAudioError = useCallback((error) => {
    console.error("🚨 Audio error:", error);

    let errorMessage = "Unknown audio error";

    if (error.name === "NotAllowedError") {
      errorMessage =
        "Microphone access denied. Please allow microphone permissions.";
    } else if (error.name === "NotFoundError") {
      errorMessage = "No microphone found. Please connect a microphone.";
    } else if (error.name === "NotReadableError") {
      errorMessage =
        "Microphone is busy or unavailable. Try closing other applications.";
    } else if (error.name === "OverconstrainedError") {
      errorMessage =
        "Microphone constraints cannot be satisfied. Try different settings.";
    } else if (error.name === "AbortError") {
      errorMessage = "Microphone access was aborted.";
    }

    setAudioError(errorMessage);
  }, []);

  // Start audio level monitoring
  const startAudioMonitoring = useCallback(() => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) {
      console.warn("⚠️ No audio track found for monitoring");
      return;
    }

    try {
      // Create audio context and analyser
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();

      // Create media stream source
      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.3;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      // Monitor audio levels
      const updateAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const level = Math.min(100, (average / 255) * 100);
        setAudioLevel(level);

        animationRef.current = requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
      console.log("🎵 Audio monitoring started");
    } catch (error) {
      console.error("Error starting audio monitoring:", error);
      handleAudioError(error);
    }
  }, [handleAudioError]);

  // Stop audio monitoring
  const stopAudioMonitoring = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setAudioLevel(0);
    console.log("🔇 Audio monitoring stopped");
  }, []);

  // Switch microphone
  const switchMicrophone = useCallback(
    async (newMicId) => {
      if (!streaming || !streamRef.current || !pcRef.current) return;

      setAudioError(null);

      try {
        console.log("🔄 Switching microphone to:", newMicId);

        // Get new audio stream with selected microphone
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            deviceId: { exact: newMicId },
            ...DEFAULT_AUDIO_CONSTRAINTS,
          },
          video: false,
        });

        // Replace audio track in peer connection
        const newAudioTrack = newStream.getAudioTracks()[0];
        const audioSender = pcRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === "audio");

        if (audioSender && newAudioTrack) {
          await audioSender.replaceTrack(newAudioTrack);

          // Replace audio track in current stream
          const oldAudioTrack = streamRef.current.getAudioTracks()[0];
          if (oldAudioTrack) {
            streamRef.current.removeTrack(oldAudioTrack);
            oldAudioTrack.stop();
          }
          streamRef.current.addTrack(newAudioTrack);

          // Restart audio monitoring with new track
          stopAudioMonitoring();
          setTimeout(startAudioMonitoring, 100);

          console.log("🎤 Microphone switched successfully");
        }
      } catch (error) {
        console.error("Error switching microphone:", error);
        handleAudioError(error);
      }
    },
    [
      streaming,
      pcRef,
      startAudioMonitoring,
      stopAudioMonitoring,
      handleAudioError,
    ]
  );

  // Apply audio quality settings to peer connection
  const applyAudioQuality = useCallback(async () => {
    if (!pcRef.current || !streamRef.current) return;

    try {
      const audioSender = pcRef.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "audio");

      if (audioSender && audioSender.getParameters) {
        const params = audioSender.getParameters();

        if (params.encodings && params.encodings.length > 0) {
          // Set audio bitrate (128kbps for good quality)
          params.encodings[0].maxBitrate = 128000;
          params.encodings[0].priority = "high"; // Prioritize audio

          await audioSender.setParameters(params);
          console.log("🎵 Audio quality applied:", {
            maxBitrate: params.encodings[0].maxBitrate,
            priority: params.encodings[0].priority,
          });
        }
      }
    } catch (error) {
      console.error("Error applying audio quality:", error);
    }
  }, [pcRef]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopAudioMonitoring();
    };
  }, [stopAudioMonitoring]);

  return {
    audioLevel,
    audioError,
    getAudioConstraints,
    checkAudioPermissions,
    handleAudioError,
    startAudioMonitoring,
    stopAudioMonitoring,
    switchMicrophone,
    applyAudioQuality,
  };
};
