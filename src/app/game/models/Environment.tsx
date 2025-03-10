'use client';

import { useRef, useEffect } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
import { Group } from 'three';
import Human from './Human';
import { cubicleWalls } from './CubicleWalls';
import { Desk, Plant, deskConfigurations, plantPositions } from './Furniture';
import Adversary from './Adversary';
import { useGameStore } from '../store/gameStore';

interface EnvironmentProps {
  humanCount?: number;
}

export default function Environment({ humanCount = 15 }: EnvironmentProps) {
  const groupRef = useRef<Group>(null);
  const { increaseHumanCount } = useGameStore();
  
  // Set up timer to increase human count periodically
  useEffect(() => {
    // Increase human count every 30 seconds
    const timer = setInterval(() => {
      increaseHumanCount();
    }, 30000);
    
    return () => clearInterval(timer);
  }, [increaseHumanCount]);
  
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
  
  return (
    <group ref={groupRef} name="environment">
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
      <group position={[0, 10, 0]}>
        {/* Create a grid of ceiling panels */}
        {Array.from({ length: 10 }).map((_, rowIndex) => 
          Array.from({ length: 10 }).map((_, colIndex) => {
            // Calculate position for each panel
            const xPos = (colIndex - 4.5) * 10;
            const zPos = (rowIndex - 4.5) * 10;
            
            return (
              <group key={`${rowIndex}-${colIndex}`} position={[xPos, 0, zPos]}>
                {/* Main ceiling panel */}
                <Box 
                  args={[9.5, 0.2, 9.5]} 
                  position={[0, 0, 0]}
                  receiveShadow
                >
                  <meshStandardMaterial 
                    color="#f0f0f0" 
                    roughness={0.7}
                    metalness={0.1}
                  />
                </Box>
                
                {/* Panel frame/grid */}
                <Box 
                  args={[10, 0.3, 0.5]} 
                  position={[0, -0.1, -4.75]}
                >
                  <meshStandardMaterial color="#d0d0d0" />
                </Box>
                <Box 
                  args={[10, 0.3, 0.5]} 
                  position={[0, -0.1, 4.75]}
                >
                  <meshStandardMaterial color="#d0d0d0" />
                </Box>
                <Box 
                  args={[0.5, 0.3, 10]} 
                  position={[-4.75, -0.1, 0]}
                >
                  <meshStandardMaterial color="#d0d0d0" />
                </Box>
                <Box 
                  args={[0.5, 0.3, 10]} 
                  position={[4.75, -0.1, 0]}
                >
                  <meshStandardMaterial color="#d0d0d0" />
                </Box>
                
                {/* Add some texture/detail to the panels */}
                {rowIndex % 3 === 0 && colIndex % 3 === 0 && (
                  <Box 
                    args={[2, 0.1, 2]} 
                    position={[0, -0.2, 0]}
                  >
                    <meshStandardMaterial color="#e8e8e8" />
                  </Box>
                )}
                
                {/* Add some light fixtures */}
                {rowIndex % 3 === 1 && colIndex % 3 === 1 && (
                  <>
                    <Box 
                      args={[4, 0.1, 4]} 
                      position={[0, -0.2, 0]}
                    >
                      <meshStandardMaterial 
                        color="#ffffff" 
                        emissive="#ffffff"
                        emissiveIntensity={0.5}
                      />
                    </Box>
                    <pointLight
                      position={[0, -1, 0]}
                      intensity={0.5}
                      distance={15}
                      decay={2}
                    />
                  </>
                )}
              </group>
            );
          })
        )}
      </group>
      
      {/* Cubicle walls - creating a maze-like office layout */}
      {cubicleWalls.map((wall, index) => (
        <Box 
          key={`cubicle-wall-${index}`}
          name={`cubicle-wall-${index}`}
          args={wall.size as [number, number, number]} 
          position={wall.pos as [number, number, number]}
          rotation={wall.rot as [number, number, number]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#e0e0e0" />
        </Box>
      ))}
      
      {/* Reception Desk - near the front of the room */}
      <group position={[0, 0, 40]}>
        {/* Main desk - straight sections with proper corners */}
        {/* Center section */}
        <Box 
          args={[4, 1.1, 0.8]} 
          position={[0, 0.55, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#5c3c2e" />
        </Box>
        
        {/* Left section */}
        <Box 
          args={[0.8, 1.1, 3]} 
          position={[-2.4, 0.55, -1.5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#5c3c2e" />
        </Box>
        
        {/* Right section */}
        <Box 
          args={[0.8, 1.1, 3]} 
          position={[2.4, 0.55, -1.5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#5c3c2e" />
        </Box>
        
        {/* Desk top - with slight overhang */}
        {/* Center section */}
        <Box 
          args={[4.2, 0.1, 1]} 
          position={[0, 1.15, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8b5a2b" />
        </Box>
        
        {/* Left section */}
        <Box 
          args={[1, 0.1, 3.2]} 
          position={[-2.4, 1.15, -1.5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8b5a2b" />
        </Box>
        
        {/* Right section */}
        <Box 
          args={[1, 0.1, 3.2]} 
          position={[2.4, 1.15, -1.5]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#8b5a2b" />
        </Box>
        
        {/* Computer on reception desk */}
        <group position={[-1.5, 1.25, -0.2]} rotation={[0, 0.3, 0]}>
          {/* Monitor */}
          <Box 
            args={[1.2, 0.8, 0.1]} 
            position={[0, 0.5, 0]}
            castShadow
          >
            <meshStandardMaterial color="#333333" />
          </Box>
          <Box 
            args={[1, 0.6, 0.05]} 
            position={[0, 0.5, 0.05]}
            castShadow
          >
            <meshStandardMaterial 
              color="#1a1a1a" 
              emissive="#3a5795"
              emissiveIntensity={0.2}
            />
          </Box>
          {/* Monitor stand */}
          <Box 
            args={[0.2, 0.4, 0.2]} 
            position={[0, 0, 0]}
            castShadow
          >
            <meshStandardMaterial color="#555555" />
          </Box>
          {/* Keyboard */}
          <Box 
            args={[0.8, 0.05, 0.3]} 
            position={[0, 0, 0.4]}
            castShadow
          >
            <meshStandardMaterial color="#222222" />
          </Box>
        </group>
        
        {/* Office chair behind reception desk */}
        <group position={[0, 0, -2.5]}>
          {/* Chair seat */}
          <Box 
            args={[0.6, 0.1, 0.6]} 
            position={[0, 0.5, 0]}
            castShadow
          >
            <meshStandardMaterial color="#333333" />
          </Box>
          
          {/* Chair back */}
          <Box 
            args={[0.6, 0.8, 0.1]} 
            position={[0, 0.9, 0.25]}
            castShadow
          >
            <meshStandardMaterial color="#333333" />
          </Box>
          
          {/* Chair base */}
          <Cylinder 
            args={[0.3, 0.3, 0.05, 16]} 
            position={[0, 0.2, 0]}
            castShadow
          >
            <meshStandardMaterial color="#555555" />
          </Cylinder>
          
          {/* Chair leg */}
          <Cylinder 
            args={[0.05, 0.05, 0.3, 8]} 
            position={[0, 0.35, 0]}
            castShadow
          >
            <meshStandardMaterial color="#555555" />
          </Cylinder>
        </group>
      </group>
      
      {/* Water Cooler */}
      <group position={[35, 0, 30]}>
        {/* Base */}
        <Box 
          args={[1, 0.5, 1]} 
          position={[0, 0.25, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#dddddd" />
        </Box>
        {/* Water container */}
        <Box 
          args={[0.8, 1.2, 0.8]} 
          position={[0, 1.5, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#a5d8ff" 
            transparent={true}
            opacity={0.7}
          />
        </Box>
        {/* Spout */}
        <Box 
          args={[0.6, 0.3, 0.6]} 
          position={[0, 0.8, 0]}
          castShadow
        >
          <meshStandardMaterial color="#eeeeee" />
        </Box>
      </group>
      
      {/* Office Desks with Computers */}
      {deskConfigurations.map((desk, index) => (
        <Desk 
          key={`desk-${index}`} 
          position={desk.position as [number, number, number]} 
          rotation={desk.rotation as [number, number, number]} 
        />
      ))}
      
      {/* Office Plants */}
      {plantPositions.map((position, index) => (
        <Plant 
          key={`plant-${index}`} 
          position={position as [number, number, number]} 
        />
      ))}
      
      {/* Conference Room Table */}
      <group position={[30, 0, -30]}>
        {/* Table */}
        <Box 
          args={[8, 0.2, 3]} 
          position={[0, 0.9, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#5c3c2e" />
        </Box>
        {/* Table legs */}
        <Box 
          args={[0.3, 0.9, 0.3]} 
          position={[3.5, 0.45, 1.2]}
          castShadow
        >
          <meshStandardMaterial color="#4a3121" />
        </Box>
        <Box 
          args={[0.3, 0.9, 0.3]} 
          position={[-3.5, 0.45, 1.2]}
          castShadow
        >
          <meshStandardMaterial color="#4a3121" />
        </Box>
        <Box 
          args={[0.3, 0.9, 0.3]} 
          position={[3.5, 0.45, -1.2]}
          castShadow
        >
          <meshStandardMaterial color="#4a3121" />
        </Box>
        <Box 
          args={[0.3, 0.9, 0.3]} 
          position={[-3.5, 0.45, -1.2]}
          castShadow
        >
          <meshStandardMaterial color="#4a3121" />
        </Box>
      </group>
      
      {/* Humans */}
      {humanPositions.map((position, index) => (
        <Human 
          key={`human-${index}`} 
          position={position} 
          scale={1}
          walkSpeed={0.3 + Math.random() * 0.4}
          outfitIndex={index}
        />
      ))}
      
      {/* Add the adversary (office secretary) */}
      <Adversary position={[0, 0, 35]} scale={[1, 1, 1]} movementSpeed={0.08} />
    </group>
  );
} 