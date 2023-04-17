import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export const Recognition = ({ start }: { start: boolean }) => {
  const [haveFace, setHaveFace] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const intervalIdRef = useRef<null | NodeJS.Timer>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRadio = 1280 / 720;
  const videoSize = 480;

  useEffect(() => {
    initElementStyle();
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((currentStream) => {
        if (!videoRef.current || !canvasRef.current)
          console.error("canvas or video is null");
        else videoRef.current.srcObject = currentStream;
      });
  };

  const handleVideoPlay = () => {
    intervalIdRef.current = setInterval(async () => {
      console.log(start);
      if (!start) return;
      setInitializing(false);
      if (videoRef.current && canvasRef.current) {
        const displaySize = {
          width: videoSize,
          height: videoSize,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks();

        const resizeDetections = faceapi.resizeResults(detections, displaySize);

        if (resizeDetections.length > 0 && !haveFace) setHaveFace(true);
        else if (resizeDetections.length === 0 && haveFace) setHaveFace(false);

        faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
      }
    }, 100);
  };

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

  const initElementStyle = () => {
    const canvasDom = canvasRef.current;
    const videoDom = videoRef.current;
    const divDom = document.getElementById("container");
    if (!canvasDom || !videoDom || !divDom) return;

    divDom.style.height = videoSize + "px";
    divDom.style.width = videoSize + "px";

    videoDom.style.height = "100%";

    canvasDom.style.height = videoSize + "px";
    canvasDom.style.width = videoSize * videoRadio + "px";

    canvasDom.style.left = `-${(videoSize * videoRadio - videoSize) / 2}px`;
  };

  const handleStop = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
  };

  return (
    <div
      className="relative w-96 overflow-hidden rounded-full  border-4 border-blue-900 bg-black"
      id="container"
    >
      <span
        className={
          "absolute top-5 left-0 right-0 z-20 text-center text-xl font-bold" +
          (initializing ? " text-red-900" : " text-green-900")
        }
      >
        <span onClick={handleStop} className="hover:cursor-pointer">
          {initializing ? "⏳" : "👌"}
        </span>
      </span>
      <video
        muted
        autoPlay
        ref={videoRef}
        onPlay={handleVideoPlay}
        height={videoSize}
        className="absolute object-cover"
      />
      <canvas ref={canvasRef} className="absolute z-10" />
      <button
        className={
          "absolute bottom-5 left-0 right-0 z-20 mx-auto w-24 rounded-md p-1 text-white " +
          (haveFace ? " bg-blue-500" : " bg-gray-500")
        }
        disabled={!haveFace}
      >
        上 传
      </button>
    </div>
  );
};
