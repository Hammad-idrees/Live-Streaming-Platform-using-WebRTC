import { useCallback } from "react";

export function useStreamLogic({
  rtcConfig,
  streaming,
  setStreaming,
  setInitializing,
  selectedCameraId,
  selectedMicId,
  setSelectedCameraId,
  setAudioEnabled,
  setVideoEnabled,
  localVideoRef,
  streamRef,
  canvasRef,
  socketRef,
  pcRef,
  streamId,
}) {
  // 🎥 Start streaming function
  const startStream = useCallback(async () => {
    if (!rtcConfig || streaming) return;

    setInitializing(true);
    try {
      console.log("🎥 [Streamer] Starting stream for room", streamId);
      socketRef.current.emit("streamer", streamId);

      const constraints = {
        audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        pcRef.current.addTrack(track, stream);
      });

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);
      console.log("📡 [Streamer] Sending offer", offer);
      socketRef.current.emit("offer", { streamId, offer });

      setStreaming(true);
      setInitializing(false);

      pcRef.current.ontrack = ({ streams: [remoteStream] }) => {
        console.log("🔄 [Streamer] Remote track received", remoteStream);
      };
    } catch (err) {
      console.error("🚨 [Streamer] Error starting stream", err);
      setInitializing(false);
      alert(
        "Failed to start stream. Please check camera/microphone permissions."
      );
    }
  }, [
    rtcConfig,
    streaming,
    streamId,
    selectedMicId,
    selectedCameraId,
    socketRef,
    streamRef,
    localVideoRef,
    pcRef,
    setStreaming,
    setInitializing,
  ]);

  // 🛑 Stop streaming function
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
    }

    socketRef.current?.emit("leave-stream", streamId);
    setStreaming(false);
    console.log("🛑 [Streamer] Stream stopped");
  }, [streamRef, localVideoRef, pcRef, socketRef, streamId, setStreaming]);

  // 📹 Switch camera
  const switchCamera = useCallback(
    async (newDeviceId) => {
      if (!streaming || !pcRef.current) return;

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: newDeviceId } },
          audio: selectedMicId ? { deviceId: { exact: selectedMicId } } : true,
        });

        const videoTrack = newStream.getVideoTracks()[0];
        const sender = pcRef.current
          .getSenders()
          .find((s) => s.track?.kind === "video");

        if (sender) {
          await sender.replaceTrack(videoTrack);
        }

        streamRef.current.getVideoTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = newStream;
        streamRef.current = newStream;
        setSelectedCameraId(newDeviceId);
      } catch (error) {
        console.error("🚨 Error switching camera:", error);
      }
    },
    [
      streaming,
      pcRef,
      selectedMicId,
      streamRef,
      localVideoRef,
      setSelectedCameraId,
    ]
  );

  // 🎤 Toggle audio
  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  }, [streamRef, setAudioEnabled]);

  // 📹 Toggle video
  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  }, [streamRef, setVideoEnabled]);

  // 🎨 Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socketRef.current?.emit("clear-canvas", streamId);
    }
  }, [canvasRef, socketRef, streamId]);

  return {
    startStream,
    stopStream,
    switchCamera,
    toggleAudio,
    toggleVideo,
    clearCanvas,
  };
}
