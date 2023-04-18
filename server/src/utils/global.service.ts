import { readdir } from 'node:fs/promises';
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs-node';
import { Canvas, Image, ImageData, createCanvas, loadImage } from 'canvas';
import * as path from 'path';
import { TNetInput } from 'face-api.js';
// const sizeOf = require('image-size');
import sizeOf from 'image-size';

// source from: https://github.com/justadudewhohacks/face-api.js/issues/546
faceapi.env.monkeyPatch({
  Canvas,
  Image,
  ImageData,
} as any);

export class GlobalService {
  // global variables source from: https://stackoverflow.com/questions/66291284/how-to-use-global-variables-in-nest-js
  static labels = [];
  static labeledFaceDescriptors = [];

  constructor() {
    this.genFaceDescriptors().then((res) => {
      GlobalService.labeledFaceDescriptors = res;
    });
  }

  private async genFaceDescriptors() {
    console.log('gen face descriptors!');
    const files = await readdir('files');
    const MODELS_PATH = path.join(__dirname, '..', '..', 'src/utils', 'models');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);

    const labeledFaceDescriptors = await Promise.all(
      files.map(async (file) => {
        const usename = file.split('.').at(0);
        const fileUrlPath = `https://localhost:3000/${file}`;
        console.log(fileUrlPath);
        try {
          const filePath = path.join(__dirname, '..', '..', 'files', file);
          const dimensions = (await sizeOf(filePath)) as {
            height: number;
            width: number;
            type: string;
          };
          console.log(dimensions);

          // source from: https://github.com/justadudewhohacks/face-api.js/issues/729
          const canvas = createCanvas(dimensions.width, dimensions.height);
          const ctx = canvas.getContext('2d');
          const img = await loadImage(filePath);
          ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

          // const img = new Image();
          // img.src = filePath;
          const fullFaceDescription = await faceapi
            .detectSingleFace(canvas as Canvas as any as TNetInput)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (!fullFaceDescription) {
            throw new Error(`no faces detected for ${usename}`);
          }
          const faceDescriptors = [fullFaceDescription.descriptor];
          return new faceapi.LabeledFaceDescriptors(usename, faceDescriptors);
        } catch (err) {
          console.log(err);
        }
      }),
    );
    return labeledFaceDescriptors;
  }
}
