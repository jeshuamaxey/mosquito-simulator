'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import { useGameStore } from '../store/gameStore';

interface HumanProps {
  position: [number, number, number];
  scale?: number;
  walkSpeed?: number;
  walkRadius?: number;
}

export default function Human({ 
  position, 
  scale = 1, 
  walkSpeed = 0.5,
  walkRadius = 3
}: HumanProps) {
  const groupRef = useRef<Group>(null);
  const [infected, setInfected] = useState(false);
  const [walkDirection, setWalkDirection] = useState(Math.random() * Math.PI * 2);
  const [walkOffset] = useState(new Vector3(
    position[0], 
    position[1], 
    position[2]
  ));
  const [walkTime, setWalkTime] = useState(0);
  const [changeDirectionTime, setChangeDirectionTime] = useState(
    Math.random() * 2 + 2
  );
  
  const { increaseInfectionCount } = useGameStore();
  
  // Handle infection
  const handleInfection = () => {
    if (!infected) {
      setInfected(true);
      increaseInfectionCount();
    }
  };
  
  // Simple walking animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Update walk time
    setWalkTime(prev => prev + delta);
    
    // Change direction randomly
    if (walkTime > changeDirectionTime) {
      setWalkDirection(Math.random() * Math.PI * 2);
      setChangeDirectionTime(Math.random() * 2 + 2);
      setWalkTime(0);
    }
    
    // Calculate new position
    const x = walkOffset.x + Math.sin(walkDirection) * Math.sin(walkTime * walkSpeed) * walkRadius;
    const z = walkOffset.z + Math.cos(walkDirection) * Math.sin(walkTime * walkSpeed) * walkRadius;
    
    // Update position
    groupRef.current.position.x = x;
    groupRef.current.position.z = z;
    
    // Update rotation to face walking direction
    groupRef.current.rotation.y = walkDirection;
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale} onClick={handleInfection}>
      {/* Body */}
      <Cylinder 
        args={[0.2, 0.3, 1, 8]} 
        position={[0, 0.5, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#3273a8"} 
        />
      </Cylinder>
      
      {/* Head */}
      <Box 
        args={[0.25, 0.25, 0.25]} 
        position={[0, 1.15, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#f9c9a3"} 
        />
      </Box>
      
      {/* Arms */}
      <Cylinder 
        args={[0.05, 0.05, 0.6, 8]} 
        position={[0.3, 0.6, 0]} 
        rotation={[0, 0, -Math.PI / 3]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#3273a8"} 
        />
      </Cylinder>
      <Cylinder 
        args={[0.05, 0.05, 0.6, 8]} 
        position={[-0.3, 0.6, 0]} 
        rotation={[0, 0, Math.PI / 3]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#3273a8"} 
        />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder 
        args={[0.07, 0.07, 0.5, 8]} 
        position={[0.1, 0.05, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#1e4258"} 
        />
      </Cylinder>
      <Cylinder 
        args={[0.07, 0.07, 0.5, 8]} 
        position={[-0.1, 0.05, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : "#1e4258"} 
        />
      </Cylinder>
    </group>
  );
} 