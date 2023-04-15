import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { TNetInput } from "face-api.js";

const MODEL_URL = "/models";

export const Recognition = () => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function recognitionImage() {
      try {
        const input = imageRef.current as HTMLElement | null;
        const canvas = canvasRef.current as HTMLCanvasElement | null;

        if (!input || !canvas) throw "input or canvas is null!";

        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkModel(MODEL_URL);
        await faceapi.loadFaceRecognitionModel(MODEL_URL);

        let fullFaceDescriptions = await faceapi
          .detectAllFaces(input as TNetInput)
          .withFaceLandmarks()
          .withFaceDescriptors();

        fullFaceDescriptions = faceapi.resizeResults(fullFaceDescriptions, {
          width: input.clientWidth,
          height: input.clientHeight,
        });

        const labels = ["sheldon", "raj", "leonard", "howard"];
        const labeledFaceDescriptors = await Promise.all(
          labels.map(async (label) => {
            const imgUrl = `${label}.png`;
            const img = await faceapi.fetchImage(imgUrl);
            // detect the face with the highest score in the image and compute it's landmarks and face descriptor
            const fullFaceDescription = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (!fullFaceDescription) {
              throw new Error(`no faces detected for ${label}`);
            }

            const faceDescriptors = [fullFaceDescription.descriptor];
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
          })
        );

        console.log(fullFaceDescriptions);

        const maxDescriptorDistance = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(
          labeledFaceDescriptors,
          maxDescriptorDistance
        );

        const results = fullFaceDescriptions.map((fd) =>
          faceMatcher.findBestMatch(fd.descriptor)
        );

        canvas.width = input.clientWidth;
        canvas.height = input.clientHeight;

        results.forEach((betsMatch, i) => {
          const box = fullFaceDescriptions[i].detection.box;
          const text = betsMatch.toString();
          const drawer = new faceapi.draw.DrawBox(box, { label: text });
          drawer.draw(canvas);
          faceapi.draw.drawFaceLandmarks(
            canvas,
            fullFaceDescriptions[i].landmarks
          );
        });
      } catch (e) {
        console.error(e);
      }
    }

    recognitionImage();
  }, []);

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src="people.jpg"
        alt="photo"
        className="absolute top-0 left-0 z-0"
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 z-10" />
    </div>
  );
};
