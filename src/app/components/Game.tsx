'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Stats, 
  Environment as DreiEnvironment
} from '@react-three/drei';
import { useFirstPersonControls } from '../game/hooks/useFirstPersonControls';
import Environment from '../game/models/Environment';
import Mosquito from '../game/models/Mosquito';
import HUD from './HUD';
import KeyboardControls from './KeyboardControls';
import { Group, Vector3, MathUtils, Object3D, Mesh, Material, Color, Euler, Quaternion, Box3 } from 'three';
import { useGameStore } from '../game/store/gameStore';
import StartDialog from './StartDialog';

export default function Game() {
  const [canInfectGlobal, setCanInfectGlobal] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Handle game start
  const handleGameStart = () => {
    setGameStarted(true);
    // Request pointer lock after game starts
    const canvas = document.querySelector('canvas');
    if (canvas && canvas.requestPointerLock) {
      canvas.requestPointerLock();
    }
  };
  
  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Crosshair - changes color when ready to infect */}
      <div className={`crosshair ${canInfectGlobal ? 'ready' : 'cooldown'}`}></div>
      
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
            
            {/* First person controller */}
            <FirstPersonController 
              setCanInfectGlobal={setCanInfectGlobal} 
              enabled={gameStarted}
            />
            
            {/* Debug */}
            <Stats />
          </Suspense>
        </Canvas>
      </KeyboardControls>
      
      {/* HUD rendered outside of Canvas to ensure proper layering */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <HUD />
      </div>
      
      {/* Start Dialog */}
      {!gameStarted && (
        <StartDialog onStart={handleGameStart} />
      )}
    </div>
  );
}

// First-person controller
function FirstPersonController({ 
  setCanInfectGlobal,
  enabled = true
}: { 
  setCanInfectGlobal: (canInfect: boolean) => void;
  enabled?: boolean;
}) {
  // Reference to the mosquito group
  const mosquitoRef = useRef<Group>(null);
  
  // Current velocity with momentum
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  
  // Mouse look state
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const mouseSensitivity = 0.002; // Adjust as needed
  
  // Camera rotation state - separate from mosquito rotation
  const cameraRotation = useRef({ x: 0, y: 0 });
  
  // World boundaries
  const WORLD_BOUNDS = {
    minX: -49, // Left wall
    maxX: 49,  // Right wall
    minY: 0.5, // Floor (with small offset to stay above it)
    maxY: 9.5, // Ceiling height (just below the ceiling panels at y=10)
    minZ: -49, // Back wall
    maxZ: 49   // Front wall
  };
  
  // Use our controls to get input velocity
  const { velocity } = useFirstPersonControls();
  
  // Get scene objects and camera
  const { scene, camera } = useThree();
  
  // Infection range and cooldown
  const INFECTION_RANGE = 1.5;
  const [canInfect, setCanInfect] = useState(true);
  const { increaseInfectionCount } = useGameStore();
  
  // Sync local and global infection states
  useEffect(() => {
    setCanInfectGlobal(canInfect);
  }, [canInfect, setCanInfectGlobal]);
  
  // Set up pointer lock for mouse controls
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    
    const requestPointerLock = () => {
      if (!isPointerLocked) {
        canvas.requestPointerLock();
      }
    };
    
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement === canvas);
    };
    
    canvas.addEventListener('click', requestPointerLock);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    
    return () => {
      canvas.removeEventListener('click', requestPointerLock);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [isPointerLocked, enabled]);
  
  // Handle mouse movement for camera orientation
  useEffect(() => {
    if (!isPointerLocked || !enabled) return;
    
    // Use quaternions for rotation to avoid gimbal lock issues
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked) return;
      
      // Calculate rotation changes
      const deltaX = -e.movementX * mouseSensitivity; // Yaw (left/right)
      const deltaY = -e.movementY * mouseSensitivity; // Pitch (up/down)
      
      // Create quaternions for the rotations around the correct axes
      // For yaw, rotate around the world up vector (0, 1, 0)
      const yawQuat = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), deltaX);
      
      // For pitch, rotate around the camera's local right vector (1, 0, 0)
      // This ensures that "up" is always "up" in the camera's view
      const pitchQuat = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), deltaY);
      
      // Apply the rotations to the camera
      // First apply yaw (around world up)
      camera.quaternion.premultiply(yawQuat);
      
      // Then apply pitch (around camera's right vector)
      camera.quaternion.multiply(pitchQuat);
      
      // Extract Euler angles from the quaternion for use elsewhere
      const euler = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');
      cameraRotation.current.x = euler.x;
      cameraRotation.current.y = euler.y;
      
      // Clamp pitch to avoid flipping
      if (cameraRotation.current.x > Math.PI / 2.1) {
        cameraRotation.current.x = Math.PI / 2.1;
        camera.quaternion.setFromEuler(new Euler(cameraRotation.current.x, cameraRotation.current.y, 0, 'YXZ'));
      }
      if (cameraRotation.current.x < -Math.PI / 2.1) {
        cameraRotation.current.x = -Math.PI / 2.1;
        camera.quaternion.setFromEuler(new Euler(cameraRotation.current.x, cameraRotation.current.y, 0, 'YXZ'));
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPointerLocked, camera, mouseSensitivity, enabled]);
  
  // Handle mouse click for infection
  useEffect(() => {
    if (!enabled) return;
    
    const handleClick = () => {
      if (!canInfect || !mosquitoRef.current) return;
      
      // Find all human objects in the scene
      const humans: Object3D[] = [];
      scene.traverse((object) => {
        // Check if this is a human by looking for a custom property
        if (object.userData.isHuman && !object.userData.infected) {
          humans.push(object);
        }
      });
      
      // Check if any human is within infection range
      const mosquitoPosition = mosquitoRef.current.position;
      for (const human of humans) {
        const distance = mosquitoPosition.distanceTo(human.position);
        if (distance <= INFECTION_RANGE) {
          // Infect the human
          human.userData.infected = true;
          
          // Change color to red (infected)
          human.traverse((child) => {
            if (child instanceof Mesh && child.material) {
              const material = child.material as Material & { color?: Color };
              if (material.color) {
                material.color.set('#a83232');
              }
            }
          });
          
          // Increase infection count
          increaseInfectionCount();
          
          // Set cooldown
          setCanInfect(false);
          setTimeout(() => setCanInfect(true), 1000); // 1 second cooldown
          
          // Only infect one human at a time
          break;
        }
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [canInfect, increaseInfectionCount, scene, enabled]);
  
  // Update mosquito position and camera position
  useFrame((state) => {
    if (!mosquitoRef.current || !enabled) return;
    
    // Get keyboard input for acceleration/deceleration
    const forwardSpeed = velocity.z;
    const hasKeyboardInput = Math.abs(forwardSpeed) > 0.001;
    
    // Create a forward vector in world space based on camera orientation
    // This is the direction the mosquito should move when pressing W
    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(camera.quaternion);
    forward.normalize();
    
    // Apply acceleration in the direction we're looking
    if (hasKeyboardInput) {
      // Calculate target velocity based on forward direction and input
      const targetVelocity = forward.clone().multiplyScalar(forwardSpeed);
      
      // Lerp current velocity toward target with momentum
      currentVelocity.current.x = MathUtils.lerp(currentVelocity.current.x, targetVelocity.x, 0.1);
      currentVelocity.current.y = MathUtils.lerp(currentVelocity.current.y, targetVelocity.y, 0.1);
      currentVelocity.current.z = MathUtils.lerp(currentVelocity.current.z, targetVelocity.z, 0.1);
    } else {
      // Apply drag when no keys are pressed
      currentVelocity.current.x *= 0.95;
      currentVelocity.current.y *= 0.95;
      currentVelocity.current.z *= 0.95;
    }
    
    // Calculate new position
    const newPosition = {
      x: mosquitoRef.current.position.x + currentVelocity.current.x,
      y: mosquitoRef.current.position.y + currentVelocity.current.y,
      z: mosquitoRef.current.position.z + currentVelocity.current.z
    };
    
    // Apply world boundaries
    newPosition.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, newPosition.x));
    newPosition.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, newPosition.y));
    newPosition.z = Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, newPosition.z));
    
    // Check for collisions with cubicle walls
    // Only check if we're below the height of the walls (3 units)
    if (mosquitoRef.current.position.y < 3.5) {
      // Find all cubicle walls in the scene
      const walls: Object3D[] = [];
      scene.traverse((object) => {
        // Check if this is a cubicle wall by looking for a custom property or by name
        if (object.name.includes('cubicle-wall')) {
          walls.push(object);
        }
      });
      
      // Check if the mosquito would collide with any wall
      for (const wall of walls) {
        // Simple AABB collision detection
        // Get wall dimensions and position
        const wallBox = new Box3().setFromObject(wall);
        
        // Create a box for the mosquito at the new position
        const mosquitoBox = new Box3();
        const mosquitoSize = 0.3; // Approximate size of mosquito
        mosquitoBox.min.set(
          newPosition.x - mosquitoSize,
          newPosition.y - mosquitoSize,
          newPosition.z - mosquitoSize
        );
        mosquitoBox.max.set(
          newPosition.x + mosquitoSize,
          newPosition.y + mosquitoSize,
          newPosition.z + mosquitoSize
        );
        
        // Check for intersection
        if (mosquitoBox.intersectsBox(wallBox)) {
          // Collision detected, prevent movement in x and z directions
          newPosition.x = mosquitoRef.current.position.x;
          newPosition.z = mosquitoRef.current.position.z;
          
          // Zero out velocity in x and z directions
          currentVelocity.current.x = 0;
          currentVelocity.current.z = 0;
          break;
        }
      }
    }
    
    // Update mosquito position with bounded values
    mosquitoRef.current.position.x = newPosition.x;
    mosquitoRef.current.position.y = newPosition.y;
    mosquitoRef.current.position.z = newPosition.z;
    
    // If we hit a boundary, zero out the corresponding velocity component
    if (newPosition.x === WORLD_BOUNDS.minX || newPosition.x === WORLD_BOUNDS.maxX) {
      currentVelocity.current.x = 0;
    }
    if (newPosition.y === WORLD_BOUNDS.minY || newPosition.y === WORLD_BOUNDS.maxY) {
      currentVelocity.current.y = 0;
    }
    if (newPosition.z === WORLD_BOUNDS.minZ || newPosition.z === WORLD_BOUNDS.maxZ) {
      currentVelocity.current.z = 0;
    }
    
    // Create a quaternion for the mosquito's rotation
    // We only want the mosquito to follow the camera's yaw (horizontal rotation)
    // Extract yaw from camera quaternion
    const euler = new Euler().setFromQuaternion(camera.quaternion, 'YXZ');
    const targetQuaternion = new Quaternion().setFromEuler(new Euler(0, euler.y, 0));
    
    // Apply smooth rotation to the mosquito
    mosquitoRef.current.quaternion.slerp(targetQuaternion, 0.1);
    
    // Position camera at the mosquito's position with a small offset
    const firstPersonOffset = new Vector3(0, 0.2, 0);
    
    // Set camera position
    state.camera.position.copy(mosquitoRef.current.position).add(firstPersonOffset);
  });
  
  return (
    <group ref={mosquitoRef} position={[0, 1.5, 0]} name="mosquito">
      <Mosquito position={[0, 0, 0]} />
    </group>
  );
} 