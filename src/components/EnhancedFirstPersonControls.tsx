import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import * as THREE from 'three';

//use : import EnhancedFirstPersonControls from './EnhancedFirstPersonControls';



const EnhancedFirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // Initialize controls
    const controls = new FirstPersonControls(camera, gl.domElement);
    
    // Configure control settings
    controls.movementSpeed = 150;
    controls.lookSpeed = 0.1;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.0;
    controls.verticalMax = 2.0;
    
    // Handle window resize
    const handleResize = () => {
      controls.handleResize();
    };
    window.addEventListener('resize', handleResize);
    
    // Set up clock for smooth controls
    const clock = new THREE.Clock();
    
    // Animation loop
    const animate = () => {
      controls.update(clock.getDelta());
    };
    
    // Subscribe to the animation loop
    const unsubscribeRender = gl.setAnimationLoop(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      gl.setAnimationLoop(null);
      unsubscribeRender();
      controls.dispose();
    };
  }, [camera, gl]);
  
  return null;
};

export default EnhancedFirstPersonControls;