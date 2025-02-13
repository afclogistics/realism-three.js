import { useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper, CameraHelper } from 'three';
import { useHelper } from '@react-three/drei';

export function Lighting() {
  const lightRef = useRef<DirectionalLight>(null);

  // Uncomment to debug shadow camera
  // useHelper(lightRef, DirectionalLightHelper, 1, 'red');
  // useHelper(lightRef, CameraHelper);

  return (
    <>
      <directionalLight
        ref={lightRef}
        color="#ffd7c4"//ffd7c4 <dawn, eaccc6 <sunset
        position={[18, 19, 5]}
        // position={[15, 15, 15]}
        intensity={7.5}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      {/* <ambientLight intensity={.0} />
      <hemisphereLight
        intensity={0.5}
        color="#ffffff"
        groundColor="#444444"
      /> */}
    </>
  );
}