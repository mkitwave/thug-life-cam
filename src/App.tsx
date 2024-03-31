import Webcam from "react-webcam";

const videoSize = {
  width: 640,
  height: 480,
};

function App() {
  return (
    <main>
      <Webcam width={videoSize.width} height={videoSize.height} />
    </main>
  );
}

export default App;
