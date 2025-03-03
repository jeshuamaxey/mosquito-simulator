'use client';

import { useRef } from 'react';
import { Box, Plane } from '@react-three/drei';
import { Group } from 'three';
import Human from './Human';

interface EnvironmentProps {
  humanCount?: number;
}

export default function Environment({ humanCount = 10 }: EnvironmentProps) {
  const groupRef = useRef<Group>(null);
  
  // Generate random positions for humans
  const humanPositions = Array.from({ length: humanCount }, () => {
    const radius = Math.random() * 30 + 10;
    const angle = Math.random() * Math.PI * 2;
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    ] as [number, number, number];
  });
  
  // Generate random positions for furniture
  const furnitureCount = 20;
  const furniturePositions = Array.from({ length: furnitureCount }, () => {
    const radius = Math.random() * 40 + 5;
    const angle = Math.random() * Math.PI * 2;
    return {
      position: [
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ] as [number, number, number],
      rotation: [0, Math.random() * Math.PI * 2, 0] as [number, number, number],
      scale: [
        Math.random() * 2 + 1,
        Math.random() * 2 + 1,
        Math.random() * 2 + 1
      ] as [number, number, number],
      type: Math.floor(Math.random() * 3) // 0: table, 1: chair, 2: cabinet
    };
  });
  
  return (
    <group ref={groupRef}>
      {/* Floor */}
      <Plane 
        args={[100, 100]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#a3a3a3" />
      </Plane>
      
      {/* Walls */}
      <Box 
        args={[100, 10, 1]} 
        position={[0, 5, -50]}
        receiveShadow
      >
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box 
        args={[100, 10, 1]} 
        position={[0, 5, 50]}
        receiveShadow
      >
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box 
        args={[1, 10, 100]} 
        position={[-50, 5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box 
        args={[1, 10, 100]} 
        position={[50, 5, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      
      {/* Ceiling */}
      <Box 
        args={[100, 1, 100]} 
        position={[0, 10, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#d0d0d0" />
      </Box>
      
      {/* Humans */}
      {humanPositions.map((position, index) => (
        <Human 
          key={index} 
          position={position} 
          scale={1}
          walkSpeed={0.3 + Math.random() * 0.4}
          walkRadius={2 + Math.random() * 3}
        />
      ))}
      
      {/* Furniture */}
      {furniturePositions.map((item, index) => {
        // Different furniture types
        switch(item.type) {
          case 0: // Table
            return (
              <group key={index} position={item.position} rotation={item.rotation}>
                <Box 
                  args={[2 * item.scale[0], 0.1, 1 * item.scale[2]]} 
                  position={[0, 0.8, 0]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial color="#8b4513" />
                </Box>
                {/* Table legs */}
                {[[-0.8, 0, -0.4], [0.8, 0, -0.4], [-0.8, 0, 0.4], [0.8, 0, 0.4]].map((pos, i) => (
                  <Box 
                    key={i}
                    args={[0.1, 0.8, 0.1]} 
                    position={[pos[0] * item.scale[0], 0.4, pos[2] * item.scale[2]]}
                    castShadow
                  >
                    <meshStandardMaterial color="#6b3510" />
                  </Box>
                ))}
              </group>
            );
          case 1: // Chair
            return (
              <group key={index} position={item.position} rotation={item.rotation}>
                <Box 
                  args={[0.6 * item.scale[0], 0.1, 0.6 * item.scale[2]]} 
                  position={[0, 0.5, 0]}
                  castShadow
                  receiveShadow
                >
                  <meshStandardMaterial color="#8b4513" />
                </Box>
                <Box 
                  args={[0.6 * item.scale[0], 0.8, 0.1]} 
                  position={[0, 1, -0.3 * item.scale[2]]}
                  castShadow
                >
                  <meshStandardMaterial color="#8b4513" />
                </Box>
                {/* Chair legs */}
                {[[-0.25, 0, -0.25], [0.25, 0, -0.25], [-0.25, 0, 0.25], [0.25, 0, 0.25]].map((pos, i) => (
                  <Box 
                    key={i}
                    args={[0.05, 0.5, 0.05]} 
                    position={[pos[0] * item.scale[0], 0.25, pos[2] * item.scale[2]]}
                    castShadow
                  >
                    <meshStandardMaterial color="#6b3510" />
                  </Box>
                ))}
              </group>
            );
          case 2: // Cabinet
            return (
              <Box 
                key={index}
                args={[1.5 * item.scale[0], 2 * item.scale[1], 0.8 * item.scale[2]]} 
                position={[item.position[0], item.position[1] + item.scale[1], item.position[2]]}
                rotation={item.rotation}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial color="#a0522d" />
              </Box>
            );
          default:
            return null;
        }
      })}
    </group>
  );
} 