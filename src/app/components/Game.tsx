'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Stats, 
  Environment as DreiEnvironment,
  OrbitControls
} from '@react-three/drei';
import { useFirstPersonControls } from '../game/hooks/useFirstPersonControls';
import Environment from '../game/models/Environment';
import Mosquito from '../game/models/Mosquito';
import HUD from './HUD';
import KeyboardControls from './KeyboardControls';
import { Group, Vector3, MathUtils } from 'three';

export default function Game() {
  return (
    <div className="w-full h-screen relative">
      <HUD />
      {/* Crosshair */}
      <div className="crosshair"></div>
      <KeyboardControls>
        <Canvas shadows>
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
            />
            
            {/* Environment */}
            <DreiEnvironment preset="apartment" />
            <Environment humanCount={15} />
            
            {/* Third person controller */}
            <ThirdPersonController />
            
            {/* Orbit controls for debugging - allows manual camera control */}
            <OrbitControls />
            
            {/* Debug */}
            <Stats />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}

// Third-person controller with fixed camera position
function ThirdPersonController() {
  // Reference to the mosquito group
  const mosquitoRef = useRef<Group>(null);
  
  // Current velocity with momentum
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  
  // Use our controls to get input velocity
  const { velocity } = useFirstPersonControls();
  
  // Update mosquito position
  useFrame(() => {
    if (!mosquitoRef.current) return;
    
    // Apply input velocity with momentum (smooth acceleration)
    currentVelocity.current.x = MathUtils.lerp(currentVelocity.current.x, velocity.x, 0.05);
    currentVelocity.current.y = MathUtils.lerp(currentVelocity.current.y, velocity.y, 0.05);
    currentVelocity.current.z = MathUtils.lerp(currentVelocity.current.z, velocity.z, 0.05);
    
    // Move the mosquito based on current velocity
    mosquitoRef.current.position.x += currentVelocity.current.x;
    // Y position is handled by the bobbing motion in the Mosquito component
    if (Math.abs(currentVelocity.current.y) > 0.01) {
      mosquitoRef.current.position.y += currentVelocity.current.y;
    }
    mosquitoRef.current.position.z += currentVelocity.current.z;
    
    // Rotate mosquito to face the direction of movement
    if (currentVelocity.current.length() > 0.01) {
      const direction = new Vector3(currentVelocity.current.x, 0, currentVelocity.current.z).normalize();
      // Use lerp for smoother rotation
      const targetAngle = Math.atan2(direction.x, direction.z);
      mosquitoRef.current.rotation.y = MathUtils.lerp(
        mosquitoRef.current.rotation.y,
        targetAngle,
        0.1
      );
    }
  });
  
  return (
    <group ref={mosquitoRef} position={[0, 1.5, 0]}>
      <Mosquito position={[0, 0, 0]} />
    </group>
  );
} 