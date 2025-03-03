import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler } from 'three';
import { useKeyboardControls } from '@react-three/drei';

// Define control scheme
export const controlKeys = {
  forward: 'KeyW',
  backward: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  up: 'Space',
  down: 'ShiftLeft',
};

export const useFirstPersonControls = (
  speed = 0.1,
  maxSpeed = 0.5,
  drag = 0.05
) => {
  const { camera } = useThree();
  const velocity = useRef(new Vector3(0, 0, 0));
  const [, getKeys] = useKeyboardControls();
  
  useFrame(() => {
    // Get current key states - safely handle null/undefined
    const keys = getKeys ? getKeys() : {};
    const forward = keys?.forward || false;
    const backward = keys?.backward || false;
    const left = keys?.left || false;
    const right = keys?.right || false;
    const up = keys?.up || false;
    const down = keys?.down || false;
    
    // Apply forces based on keys
    const direction = new Vector3();
    
    // Forward/backward in camera direction
    if (forward) {
      direction.z -= 1;
    }
    if (backward) {
      direction.z += 1;
    }
    
    // Left/right relative to camera
    if (left) {
      direction.x -= 1;
    }
    if (right) {
      direction.x += 1;
    }
    
    // Up/down in world space
    if (up) {
      direction.y += 1;
    }
    if (down) {
      direction.y -= 1;
    }
    
    // Normalize direction vector
    if (direction.length() > 0) {
      direction.normalize();
    }
    
    // Convert direction to camera space
    const cameraDirection = direction.clone();
    cameraDirection.applyEuler(new Euler(0, camera.rotation.y, 0));
    
    // Apply acceleration
    velocity.current.x += cameraDirection.x * speed;
    velocity.current.y += direction.y * speed; // Keep y in world space
    velocity.current.z += cameraDirection.z * speed;
    
    // Apply drag
    velocity.current.x *= (1 - drag);
    velocity.current.y *= (1 - drag);
    velocity.current.z *= (1 - drag);
    
    // Limit max speed
    const currentSpeed = velocity.current.length();
    if (currentSpeed > maxSpeed) {
      velocity.current.multiplyScalar(maxSpeed / currentSpeed);
    }
  });
  
  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game controls
      if (Object.values(controlKeys).includes(e.code)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return { velocity: velocity.current };
}; 