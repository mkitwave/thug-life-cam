import "@tensorflow/tfjs-core";
import Webcam from "react-webcam";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { useEffect, useRef } from "react";
import "./app.css";

const videoSize = {
  width: 640,
  height: 480,
};

const loadDetectionModel = () => {
  return faceLandmarksDetection.createDetector(
    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
    {
      runtime: "mediapipe",
      maxFaces: 2,
      refineLandmarks: false,
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    },
  );
};

const facePoint = {
  leftEyeTop: 124,
  rightEyeTop: 276,
  leftEyeBottom: 111,
};

const calculateFilterPosition = (
  keypoints: faceLandmarksDetection.Keypoint[],
) => {
  const xPadding = 30;
  const yPadding = 10;

  const x = keypoints[facePoint.leftEyeTop].x - xPadding;
  const y = keypoints[facePoint.leftEyeTop].y - yPadding;
  const width =
    keypoints[facePoint.rightEyeTop].x -
    keypoints[facePoint.leftEyeTop].x +
    xPadding * 2;
  const height =
    keypoints[facePoint.leftEyeBottom].y -
    keypoints[facePoint.leftEyeTop].y +
    yPadding * 2;

  return {
    x,
    y,
    width,
    height,
  };
};

function App() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialLoadedRef = useRef<boolean>(false);

  const estimateFaces = (
    model: faceLandmarksDetection.FaceLandmarksDetector,
    image: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
  ) => {
    const video = webcamRef.current?.video;

    if (!video) return;

    model.estimateFaces(video).then((face) => {
      const { x, y, width, height } = calculateFilterPosition(
        face[0].keypoints,
      );
      ctx.clearRect(0, 0, videoSize.width, videoSize.height);
      ctx.drawImage(image, x, y, width, height);

      requestAnimationFrame(() => estimateFaces(model, image, ctx));
    });
  };

  useEffect(() => {
    const video = webcamRef.current?.video;
    const canvasContext = canvasRef.current?.getContext("2d");

    if (!video || !canvasContext || initialLoadedRef.current) return;

    initialLoadedRef.current = true;

    const image = new Image();
    image.src = "sunglasses.png";

    loadDetectionModel().then((model) => {
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
    </main>
  );
}

export default App;
