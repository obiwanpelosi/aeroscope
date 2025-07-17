import "./App.css";
import GlobeComponent from "./components/globe";

function App() {

  return (
    <>
      <GlobeComponent planeCoords={{ lat: 6.6085, lng: 3.2281}} />
    </>
  );
}

export default App;
