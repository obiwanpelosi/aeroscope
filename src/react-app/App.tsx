import "./App.css";
import GlobeComponent from "./components/globe";

function App() {

  return (
    <>
      <GlobeComponent 
        departure={{ lat: 40.7128, lng: -74.0060 }} // New York
        destination={{ lat: 51.5074, lng: -0.1278 }} // London
        currentPlane={{ lat: 6.6085, lng: 3.2281 }} // Current position
      />
    </>
  );
}

export default App;
