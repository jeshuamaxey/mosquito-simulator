'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { Group } from 'three';

interface MosquitoProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Mosquito({ 
  position = [0, 0, 0], 
  scale = 0.05 
}: MosquitoProps) {
  const groupRef = useRef<Group>(null);
  
  // Animate wings
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Wing flapping animation
    const wingSpeed = 30;
    const wingAngle = Math.sin(clock.getElapsedTime() * wingSpeed) * 0.5 + 0.5;
    
    // Get wing elements (children 1 and 2)
    const leftWing = groupRef.current.children[1];
    const rightWing = groupRef.current.children[2];
    
    if (leftWing && rightWing) {
      leftWing.rotation.z = wingAngle * Math.PI / 2;
      rightWing.rotation.z = -wingAngle * Math.PI / 2;
    }
    
    // Add a slight bobbing motion
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale} rotation={[0, Math.PI, 0]}>
      {/* Body */}
      <group>
        {/* Head */}
        <Sphere 
          args={[1, 16, 16]} 
          position={[0, 0, 2]}
        >
          <meshStandardMaterial color="#333333" />
        </Sphere>
        
        {/* Proboscis (needle) */}
        <Cylinder 
          args={[0.1, 0.05, 3, 8]} 
          position={[0, -0.5, 3.5]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshStandardMaterial color="#222222" />
        </Cylinder>
        
        {/* Thorax */}
        <Sphere 
          args={[1.2, 16, 16]} 
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="#333333" />
        </Sphere>
        
        {/* Abdomen */}
        <Sphere 
          args={[1, 16, 16]} 
          position={[0, 0, -2]} 
          scale={[1, 1, 2]}
        >
          <meshStandardMaterial color="#4d4d4d" />
        </Sphere>
      </group>
      
      {/* Left Wing */}
      <Box 
        args={[5, 0.1, 2]} 
        position={[3, 0.5, 0]} 
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.3} />
      </Box>
      
      {/* Right Wing */}
      <Box 
        args={[5, 0.1, 2]} 
        position={[-3, 0.5, 0]} 
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial color="#aaaaaa" transparent opacity={0.3} />
      </Box>
      
      {/* Legs */}
      {[...Array(6)].map((_, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        const segment = Math.floor(i / 2);
        return (
          <Cylinder 
            key={i}
            args={[0.1, 0.05, 4, 8]} 
            position={[side * 1, -1, segment - 1]} 
            rotation={[0, 0, side * Math.PI / 4]}
          >
            <meshStandardMaterial color="#222222" />
          </Cylinder>
        );
      })}
    </group>
  );
} 