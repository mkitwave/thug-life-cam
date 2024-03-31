import Webcam from "react-webcam";
import "./app.css";

const videoSize = {
  width: 640,
  height: 480,
};

function App() {
  return (
    <main>
      <div className="webcam-container">
        <Webcam width={videoSize.width} height={videoSize.height} />
        <canvas
          width={videoSize.width}
          height={videoSize.height}
          className="filter-canvas"
        />
      </div>
    </main>
  );
}

export default App;
