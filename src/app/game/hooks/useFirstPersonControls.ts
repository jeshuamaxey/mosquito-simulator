import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useKeyboardControls } from '@react-three/drei';

// Define control scheme - only forward/backward
export const controlKeys = {
  forward: 'KeyW',
  backward: 'KeyS',
  // Removed left/right as mouse will handle turning
};

export const useFirstPersonControls = (
  speed = 0.1,
  maxSpeed = 0.5,
  drag = 0.05
) => {
  const velocity = useRef(new Vector3(0, 0, 0));
  const [, getKeys] = useKeyboardControls();
  
  useFrame(() => {
    // Get current key states - safely handle null/undefined
    const keys = getKeys ? getKeys() : {};
    const forward = keys?.forward || false;
    const backward = keys?.backward || false;
    
    // Apply forces based on keys - only forward/backward
    let acceleration = 0;
    
    if (forward) {
      // W key should be positive for forward movement
      acceleration = speed;
    } else if (backward) {
      // S key should be negative for backward movement
      acceleration = -speed;
    }
    
    // Set velocity directly from input - only z component for forward/backward
    velocity.current.z = acceleration;
    
    // Apply drag when no input
    if (acceleration === 0) {
      velocity.current.z *= (1 - drag);
    }
    
    // Limit max speed
    const currentSpeed = Math.abs(velocity.current.z);
    if (currentSpeed > maxSpeed) {
      velocity.current.z = Math.sign(velocity.current.z) * maxSpeed;
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