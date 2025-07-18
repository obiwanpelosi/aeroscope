import React, { useEffect, useRef, useState, useMemo } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import earthImage from "../assets/earth-night.jpg";
import nightSkyImage from "../assets/night-sky.png";
import { countries } from "../constants/countries";
import { colours } from "../constants/colours";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

interface PlaneCoords {
  lat: number;
  lng: number;
}

interface GlobeComponentProps {
  departure: PlaneCoords;
  destination: PlaneCoords;
  currentPlane: PlaneCoords;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({
  departure,
  destination,
  currentPlane,
}) => {
  const globeEl = useRef<GlobeMethods>(undefined);
  const [planeObj, setPlaneObj] = useState<THREE.Object3D | null>(null);
  const [showPolygons, setShowPolygons] = useState(true);

  const planeData = useMemo(() => {
    return currentPlane && planeObj
      ? [
          {
            lat: currentPlane.lat,
            lng: currentPlane.lng,
            obj: planeObj.clone(),
          },
        ]
      : [];
  }, [currentPlane, planeObj, showPolygons]);

  const expectedFlightPathData = useMemo(() => {
    return {
      startLat: departure.lat,
      startLng: departure.lng,
      endLat: destination.lat,
      endLng: destination.lng,
      color: ["#87b6e8ff", "#87b6e8ff"],
    };
  }, [departure, destination]);

  const actualFlightPathData = useMemo(() => {
    return {
      startLat: departure.lat,
      startLng: departure.lng,
      endLat: currentPlane.lat,
      endLng: currentPlane.lng,
      color: ["#20cb5fff", "#20cb5fff"],
    };
  }, [departure, currentPlane]);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/plane.gltf", (gltf) => {
      const plane = gltf.scene;
      plane.scale.set(0.5, 0.5, 0.5);
      setPlaneObj(plane);
    });
  }, []);

  useEffect(() => {
    if (currentPlane && globeEl.current) {
      globeEl.current.pointOfView(
        { lat: currentPlane.lat, lng: currentPlane.lng, altitude: 1.5 },
        1000
      );
    }
  }, [currentPlane]);

  const calculateBearing = (start: PlaneCoords, end: PlaneCoords) => {
    const lat1 = (start.lat * Math.PI) / 180;
    const lat2 = (end.lat * Math.PI) / 180;
    const deltaLng = ((end.lng - start.lng) * Math.PI) / 180;

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    return Math.atan2(y, x);
  };

  return (
    <div style={{ position: "relative" }}>
      <Globe
        ref={globeEl}
        //   globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        globeImageUrl={earthImage}
        backgroundImageUrl={nightSkyImage}
        // pointsData={planeData}
        // pointLat="lat"
        // pointLng="lng"
        // pointAltitude={0.02}
        // pointColor={() => 'red'}
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonUseDots={true}
        hexPolygonColor={() => {
          return colours[Math.floor(Math.random() * colours.length)];
        }}
        polygonsData={showPolygons ? countries.features : undefined}
        polygonCapColor={() => "rgba(0, 255, 255, 0.05)"}
        polygonSideColor={() => "rgba(0, 100, 255, 0.15)"}
        polygonStrokeColor={() => "#00ffff"}
        polygonLabel={(d: { properties?: { NAME?: string } }) => `
          ${d.properties?.NAME || ""}
        `}
        customLayerData={planeData}
        customThreeObject={(d) => (d as { obj: THREE.Object3D }).obj}
        customThreeObjectUpdate={(obj, d) => {
          if (globeEl.current) {
            const { lat, lng } = d as { lat: number; lng: number };
            Object.assign(
              obj.position,
              globeEl.current.getCoords(lat, lng, 0.08)
            );

            // Make plane face destination
            const bearing = calculateBearing(currentPlane, destination);
            obj.rotation.y = bearing;
          }
        }}
        arcsData={[expectedFlightPathData, actualFlightPathData]}
        arcColor={"color"}
        arcStroke={0.8}
        arcAltitude={0.1}
      />
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowPolygons(!showPolygons)}
          style={{
            padding: "12px 20px",
            backgroundColor: showPolygons ? "#4CAF50" : "#f44336",
            color: "white",
            border: "2px solid white",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
            minWidth: "120px",
          }}
        >
          {showPolygons ? "Hide" : "Show"} grid lines
        </button>
      </div>
    </div>
  );
};

export default GlobeComponent;
