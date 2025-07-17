import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import earthImage from '../assets/earth-night.jpg';
import nightSkyImage from '../assets/night-sky.png';
import { countries } from '../constants/countries';
import { colours } from '../constants/colours';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';;
import * as THREE from 'three';

interface PlaneCoords {
  lat: number;
  lng: number;
}

interface GlobeComponentProps {
  planeCoords?: PlaneCoords | null;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({ planeCoords = { lat: 0, lng: 0 } }) => {
  const globeEl = useRef<GlobeMethods>(undefined);
  const [planeObj, setPlaneObj] = useState<THREE.Object3D | null>(null);


  const planeData = useMemo(() => {
    return planeCoords && planeObj
      ? [{
          lat: planeCoords.lat,
          lng: planeCoords.lng,
          obj: planeObj.clone()
        }]
      : [];
  }, [planeCoords, planeObj]);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/plane.gltf', gltf => {
      const plane = gltf.scene;
      plane.scale.set(0.5, 0.5, 0.5);
      setPlaneObj(plane);
    });
  }, []);


  useEffect(() => {
    if (planeCoords && globeEl.current) {
      globeEl.current.pointOfView({ lat: planeCoords.lat, lng: planeCoords.lng, altitude: 1.5 }, 1000);
    }
  }, [planeCoords]);

  return (
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
      // polygonsData={countries.features}
      polygonCapColor={() => 'rgba(0, 255, 255, 0.05)'}
      polygonSideColor={() => 'rgba(0, 100, 255, 0.15)'}
      polygonStrokeColor={() => '#00ffff'}
      polygonLabel={({ properties: d } ) => `
          ${d.NAME}
        `}
      customLayerData={planeData}
      customThreeObject={d => (d as { obj: THREE.Object3D }).obj}
      customThreeObjectUpdate={(obj, d) => {
        if(globeEl.current) {
          Object.assign(obj.position, globeEl.current.getCoords(d.lat, d.lng, 0.08));
        }
        obj.lookAt(0, 0, 0); // Optional: face earth center
      }}
    />
  );
};

export default GlobeComponent;
