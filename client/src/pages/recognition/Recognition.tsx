import { FaceMatch, LabeledFaceDescriptors } from "face-api.js";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { API_BASE } from "@/global";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

export const Recognition = () => {
  const videoRadio = 1280 / 720;
  const videoSize = 480;
  const [initializing, setInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalIdRef = useRef<null | NodeJS.Timer>(null);
  const MODEL_URL = "/models";
  const [name, setName] = useState("");
  const [result, setResult] = useState(false);

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

    setInterval(async () => {
      setInitializing(false);
      setResult(false);
      setName("");

      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const displaySize = {
          width: videoSize * videoRadio,
          height: videoSize,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        let fullFaceDescriptions = await faceapi
          .detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();
        fullFaceDescriptions = faceapi.resizeResults(
          fullFaceDescriptions,
          displaySize
        );

        const maxDescriptorDistance = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          maxDescriptorDistance
        );

        const results = fullFaceDescriptions.map((fd) =>
          faceMatcher.findBestMatch(fd.descriptor)
        );

        results.forEach((bestMatch: FaceMatch, i: number) => {
          const text = bestMatch.toString();
          const name = text.split(" ")[0];
          console.log(text);
          if (name === "unknown") setResult(false);
          else setResult(true);
          setName(name);
          const box = fullFaceDescriptions[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: text });
          drawBox.draw(canvas);
        });
      }
    }, 5000);
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

  return (
    <div className=" flex h-screen w-full flex-col items-center bg-blue-300">
      <div
        className="relative w-96 overflow-hidden rounded-full border-4 border-blue-900 bg-black"
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
        <h1 className="absolute bottom-5 left-0 right-0 z-20 mx-auto w-max text-white ">
          {name}
        </h1>
      </div>
      <ResultInfo resultType={result ? "success" : "error"} />
    </div>
  );
};

export const ResultInfo = ({ resultType }: { resultType: string }) => {
  switch (resultType) {
    case "success":
      return (
        <div>
          <CheckCircleIcon color="success" sx={{ width: 64, height: 64 }} />
          <p className="font-bold">签到成功</p>
        </div>
      );
    case "error":
      return (
        <div>
          <BlockIcon color="error" sx={{ width: 64, height: 64 }} />
          <p className="font-bold">签到失败</p>
        </div>
      );

    default:
      return <div>Default</div>;
  }
};
