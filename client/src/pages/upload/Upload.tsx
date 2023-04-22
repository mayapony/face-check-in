import { Navbar } from "@/components/layouts/navbar/navbar";
import { API_BASE } from "@/global";
import { localGet } from "@/utils";
import axios from "axios";
import * as faceapi from "face-api.js";
import { FaceDetection } from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { UploadDialog } from "./UploadDialog";

export const Upload = () => {
  const videoRadio = 1280 / 720;
  const videoSize = 480;
  const [initializing, setInitializing] = useState(false);
  const [haveFace, setHaveFace] = useState(false);
  const [checkedActivity, setCheckedActivity] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalIdRef = useRef<null | NodeJS.Timer>(null);
  const detectionsRef = useRef<null | FaceDetection>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    initElementStyle();
    loadCheckedActivity();
  }, []);

  const loadCheckedActivity = () => {
    axios
      .get(`${API_BASE}/users/one/${localGet("userID")}`)
      .then(({ data }) => {
        if (data) {
          if (data.activity) {
            setCheckedActivity(data.activity.name);
          }
        }
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
    loadModels();
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
      <Navbar
        handleUpdateImage={handleUpdateImage}
        handleUpdateInfo={handleClickOpen}
      />
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

      <h1 className="text-lg font-bold">
        {checkedActivity ? `已参加活动：${checkedActivity}` : "暂未选择活动！"}
      </h1>

      <UploadDialog
        open={open}
        handleClose={handleClose}
        setCheckedActivity={setCheckedActivity}
      />
    </div>
  );
};
