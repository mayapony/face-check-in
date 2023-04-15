import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

export const Upload = () => {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      setInitializing(true);

      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]).then(startVideo);
    };

    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        if (!videoRef.current || !canvasRef.current)
          console.error("canvas or video is null");
        else videoRef.current.srcObject = currentStream;
      });
  };

  const handleVideoPlay = () => {
    setInterval(async () => {
      setInitializing(false);
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks();

        const resizeDetections = faceapi.resizeResults(detections, displaySize);

        // console.log(resizeDetections);
        faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
      }
    }, 100);
  };

  return (
    <div>
      <span>{initializing ? "Initializing" : "Ready"}</span>
      <div className="relative">
        <video
          muted
          autoPlay
          ref={videoRef}
          height={videoHeight}
          width={videoWidth}
          onPlay={handleVideoPlay}
          className="absolute top-0 left-0"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 border-2 border-red-600"
          width={videoWidth}
          height={videoHeight}
        />
      </div>
    </div>
  );
};
