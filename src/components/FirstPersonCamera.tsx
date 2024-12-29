import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3, Euler } from 'three';
import { PointerLockControls } from '@react-three/drei';
import { MOVEMENT, KEYS, type Movement } from '../utils/movement';
import { HeadBob } from '../utils/headBob';

export function FirstPersonCamera() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const movement = useRef<Movement>({});
  const velocity = useRef<Vector3>(new Vector3());
  const verticalVelocity = useRef<number>(0);
  const isGrounded = useRef<boolean>(true);
  const headBob = useRef<HeadBob>(new HeadBob());
  
  useEffect(() => {
    // Set initial camera height to player height
    camera.position.y = MOVEMENT.PLAYER_HEIGHT;
  }, [camera]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.code as keyof typeof KEYS;
      if (KEYS[key]) movement.current[KEYS[key]] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.code as keyof typeof KEYS;
      if (KEYS[key]) movement.current[KEYS[key]] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (controlsRef.current?.isLocked) {
      // Apply gravity and handle jumping
      if (isGrounded.current && movement.current.jump) {
        verticalVelocity.current = MOVEMENT.JUMP_FORCE;
        isGrounded.current = false;
      }

      verticalVelocity.current += MOVEMENT.GRAVITY * delta;
      camera.position.y += verticalVelocity.current * delta;

      // Ground check
      if (camera.position.y <= MOVEMENT.PLAYER_HEIGHT) {
        camera.position.y = MOVEMENT.PLAYER_HEIGHT;
        verticalVelocity.current = 0;
        isGrounded.current = true;
      }

      // Calculate movement speed with sprint
      const isSprinting = movement.current.sprint;
      const currentSpeed = MOVEMENT.SPEED * (isSprinting ? MOVEMENT.SPRINT_MULTIPLIER : 1);
      const speedDelta = delta * currentSpeed;

      // Reversed W/S controls
      if (movement.current.forward) {
        velocity.current.z = speedDelta;
      }
      if (movement.current.backward) {
        velocity.current.z = -speedDelta;
      }
      // Reversed A/D controls
      if (movement.current.left) {
        velocity.current.x = speedDelta;
      }
      if (movement.current.right) {
        velocity.current.x = -speedDelta;
      }

      // Apply head bobbing
      const isMoving = velocity.current.length() > 0 && isGrounded.current;
      const bobOffset = headBob.current.update(delta, isMoving, isSprinting);
      camera.position.y += bobOffset;

      if (controlsRef.current) {
        const cameraDirection = new Vector3();
        camera.getWorldDirection(cameraDirection);
        const rotation = new Euler(0, Math.atan2(cameraDirection.x, cameraDirection.z), 0);
        
        velocity.current.applyEuler(rotation);
        camera.position.add(velocity.current);
      }
    }
    
    velocity.current.set(0, 0, 0);
  });

  return <PointerLockControls ref={controlsRef} />;
}