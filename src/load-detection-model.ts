import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export const loadDetectionModel = () => {
  return faceLandmarksDetection.createDetector(
    faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
    {
      runtime: "tfjs",
      maxFaces: 2,
      refineLandmarks: false,
    },
  );
};
