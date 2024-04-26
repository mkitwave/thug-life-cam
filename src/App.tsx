import "@mediapipe/face_mesh";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-core";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./app.css";
import { calculateFilterPosition } from "./calculate-filter-position";
import { loadDetectionModel } from "./load-detection-model";

const videoSize = {
  width: 640,
  height: 480,
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialLoadedRef = useRef<boolean>(false);
  const [status, setStatus] = useState<
    "Initializing..." | "Load Model..." | "Model Loaded"
  >("Initializing...");

  const estimateFaces = (
    model: faceLandmarksDetection.FaceLandmarksDetector,
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    const video = webcamRef.current?.video;

    if (!video) return;

    model.estimateFaces(video).then((face) => {
      ctx.clearRect(0, 0, videoSize.width, videoSize.height);
      if (face[0]) {
        const { x, y, width, height } = calculateFilterPosition(
          face[0].keypoints,
        );
        ctx.drawImage(image, x, y, width, height);
      }
      requestAnimationFrame(() => estimateFaces(model, image, ctx));
    });
  };

  useEffect(() => {
    const canvasContext = canvasRef.current?.getContext("2d");

    if (!canvasContext || initialLoadedRef.current) return;

    initialLoadedRef.current = true;

    const image = new Image();
    image.src = "sunglasses.png";

    setStatus("Load Model...");

    loadDetectionModel().then((model) => {
      setStatus("Model Loaded");
      requestAnimationFrame(() => estimateFaces(model, image, canvasContext));
    });
  }, []);

  return (
    <main>
      <div className="webcam-container">
        <Webcam
          width={videoSize.width}
          height={videoSize.height}
          ref={webcamRef}
        />
        <canvas
          width={videoSize.width}
          height={videoSize.height}
          ref={canvasRef}
          className="filter-canvas"
        />
      </div>
      <p className="status">{status}</p>
    </main>
  );
}

export default App;
