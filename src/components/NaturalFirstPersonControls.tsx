import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NaturalFirstPersonControls: React.FC = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // Initial camera setup
    camera.position.set(0, 1.7, 5); // Height set to average human height (~1.7m)
    
    // Movement state
    const movement = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };
    
    // Settings
    const walkSpeed = 3; // meters per second
    const mouseSensitivity = 0.002;
    let isLocked = false;

    // Handle pointer lock
    const requestPointerLock = () => {
      gl.domElement.requestPointerLock();
    };

    const handleLockChange = () => {
      isLocked = document.pointerLockElement === gl.domElement;
    };

    // Handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      if (!isLocked) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      // Rotate camera left/right
      camera.rotation.y -= movementX * mouseSensitivity;

      // Limit vertical rotation
      const potentialRotation = camera.rotation.x - movementY * mouseSensitivity;
      const maxRotation = Math.PI / 3; // 60 degrees up/down
      camera.rotation.x = Math.max(-maxRotation, Math.min(maxRotation, potentialRotation));
    };

    // Handle keyboard
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': movement.forward = true; break;
        case 'KeyS': case 'ArrowDown': movement.backward = true; break;
        case 'KeyA': case 'ArrowLeft': movement.left = true; break;
        case 'KeyD': case 'ArrowRight': movement.right = true; break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': movement.forward = false; break;
        case 'KeyS': case 'ArrowDown': movement.backward = false; break;
        case 'KeyA': case 'ArrowLeft': movement.left = false; break;
        case 'KeyD': case 'ArrowRight': movement.right = false; break;
      }
    };

    // Movement update function
    const updateMovement = () => {
      if (!isLocked) return;

      const direction = new THREE.Vector3();
      const forward = new THREE.Vector3(0, 0, -1);
      const right = new THREE.Vector3(1, 0, 0);

      // Apply camera rotation to movement direction
      forward.applyQuaternion(camera.quaternion);
      right.applyQuaternion(camera.quaternion);

      // Zero out the y component to keep movement on 2D plane
      forward.y = 0;
      right.y = 0;
      
      // Normalize vectors after zeroing y to maintain consistent speed
      forward.normalize();
      right.normalize();

      if (movement.forward) direction.add(forward);
      if (movement.backward) direction.sub(forward);
      if (movement.right) direction.add(right);
      if (movement.left) direction.sub(right);

      // Normalize and apply movement
      if (direction.length() > 0) {
        direction.normalize();
        camera.position.addScaledVector(direction, walkSpeed * 0.016); // 0.016 is roughly one frame at 60fps
      }

      // Keep camera at constant height
      camera.position.y = 1.7;
    };

    // Set up animation loop
    const animate = () => {
      updateMovement();
    };

    // Add event listeners
    gl.domElement.addEventListener('click', requestPointerLock);
    document.addEventListener('pointerlockchange', handleLockChange);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Subscribe to animation loop
    const unsubscribeRender = gl.setAnimationLoop(animate);

    // Cleanup
    return () => {
      gl.domElement.removeEventListener('click', requestPointerLock);
      document.removeEventListener('pointerlockchange', handleLockChange);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      gl.setAnimationLoop(null);
      unsubscribeRender();
    };
  }, [camera, gl]);

  return null;
};

export default NaturalFirstPersonControls;