import { type Keypoint } from "@tensorflow-models/face-landmarks-detection";

const facePoint = {
  leftEyeTop: 124,
  rightEyeTop: 276,
  leftEyeBottom: 111,
};

export const calculateFilterPosition = (keypoints: Keypoint[]) => {
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
