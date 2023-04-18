import { Navbar } from "@/components/layouts/navbar/navbar";
import { API_BASE } from "@/global";
import { localGet } from "@/utils";
import axios from "axios";
import * as faceapi from "face-api.js";
import { FaceDetection, FaceMatch, LabeledFaceDescriptors } from "face-api.js";
import { useEffect, useRef, useState } from "react";

export const Upload = () => {
  const videoRadio = 1280 / 720;
  const videoSize = 480;
  const [initializing, setInitializing] = useState(false);
  const [haveFace, setHaveFace] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalIdRef = useRef<null | NodeJS.Timer>(null);
  const detectionsRef = useRef<null | FaceDetection>(null);
  const MODEL_URL = "/models";

  useEffect(() => {
    initElementStyle();
    loadModels();
    startVideo();
  }, []);

  const loadModels = async () => {
    setInitializing(true);

    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
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
    matchAndDrawName();
  };

  const matchAndDrawName = async () => {
    await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    await faceapi.loadFaceRecognitionModel(MODEL_URL);

    let labeledFaceDescriptors = (
      await axios.get(`${API_BASE}/users/descriptors`)
    ).data as LabeledFaceDescriptors[];
    labeledFaceDescriptors = labeledFaceDescriptors.map((des) => {
      return new LabeledFaceDescriptors(des.label, [
        new Float32Array(des.descriptors[0]),
      ]);
    });
    console.log(labeledFaceDescriptors);

    const flag = 0;
    const FACE_PASS = 1;
    const FACE_ERROR = -1;
    const FACE_NORMAL = 0;

    setInterval(async () => {
      setInitializing(false);
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const displaySize = {
          width: videoSize,
          height: videoSize,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const fullFaceDescriptions = await faceapi
          .detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();
        faceapi.draw.drawDetections(canvas, fullFaceDescriptions);

        const maxDescriptorDistance = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          maxDescriptorDistance
        );

        const results = fullFaceDescriptions.map((fd) =>
          faceMatcher.findBestMatch(fd.descriptor)
        );

        console.log(results);

        results.forEach((bestMatch: FaceMatch, i: number) => {
          const box = fullFaceDescriptions[i].detection.box;
          const text = bestMatch.toString();
          const drawBox = new faceapi.draw.DrawBox(box, { label: text });
          drawBox.draw(canvas);
        });
      }
    }, 3000);
  };

  const drawDetectAndFaceLandmark = () => {
    intervalIdRef.current = setInterval(async () => {
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
        if (detections.length > 0)
          detectionsRef.current = detections[0].detection;
        else detectionsRef.current = null;

        const resizeDetections = faceapi.resizeResults(detections, displaySize);

        if (resizeDetections.length > 0 && !haveFace) setHaveFace(true);
        else if (resizeDetections.length === 0 && haveFace) setHaveFace(false);

        faceapi.draw.drawDetections(canvasRef.current, resizeDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
        // faceapi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
      }
    }, 100);
  };

  const handleUpdateImage = () => {
    drawDetectAndFaceLandmark();
  };

  const handleStop = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);

      if (canvasRef.current) {
        console.log("清空～");
        const ctx = canvasRef.current.getContext("2d");
        ctx?.clearRect(
          0,
          0,
          canvasRef.current.clientWidth,
          canvasRef.current.clientHeight
        );
      }
    }
  };

  const handleSubmitImage = async () => {
    if (!detectionsRef.current || !videoRef.current) {
      return;
    }
    const formData = new FormData();
    const allCanvas = (await faceapi.extractFaces(videoRef.current, [
      detectionsRef.current,
    ])) as HTMLCanvasElement[];
    if (allCanvas.length === 0) return;
    const cvs = allCanvas[0];

    const img = new Image();
    img.src = cvs.toDataURL("image/png");

    fetch(img.src)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${localGet("name")}.png`, blob);
        formData.append("file", file);
        axios.post(`${API_BASE}/users/upload`, formData).then((res) => {
          if (res.data) {
            alert("上传成功");
            handleStop();
          }
        });
      });
  };

  return (
    <div className=" flex h-screen w-full flex-col items-center bg-blue-300">
      <Navbar handleUpdateImage={handleUpdateImage} />
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
          <span onClick={handleStop}>{initializing ? "⏳" : "👌"}</span>
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
          onClick={handleSubmitImage}
        >
          上 传
        </button>
      </div>
    </div>
  );
};
