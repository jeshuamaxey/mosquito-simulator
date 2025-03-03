'use client';

import { useRef } from 'react';
import { Box, Plane, Cylinder } from '@react-three/drei';
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
      
      {/* Reception Desk - near the front of the room */}
      <group position={[0, 0, 40]}>
        {/* Main curved desk */}
        <group position={[0, 1.1, 0]}>
          {/* Create a curved desk using multiple segments */}
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i - 3) * 0.2;
            const xPos = Math.sin(angle) * 6;
            const zPos = -Math.cos(angle) * 6;
            const rotation = angle + Math.PI / 2;
            
            return (
              <Box 
                key={`desk-${i}`}
                args={[2, 1.1, 0.8]} 
                position={[xPos, 0, zPos]}
                rotation={[0, rotation, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial color="#5c3c2e" />
              </Box>
            );
          })}
          
          {/* Desk top */}
          {Array.from({ length: 7 }).map((_, i) => {
            const angle = (i - 3) * 0.2;
            const xPos = Math.sin(angle) * 6;
            const zPos = -Math.cos(angle) * 6;
            const rotation = angle + Math.PI / 2;
            
            return (
              <Box 
                key={`desktop-${i}`}
                args={[2.2, 0.1, 1]} 
                position={[xPos, 0.6, zPos]}
                rotation={[0, rotation, 0]}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial color="#8b5a2b" />
              </Box>
            );
          })}
        </group>
        
        {/* Computer on reception desk */}
        <group position={[-3, 1.8, -5.5]} rotation={[0, 0.4, 0]}>
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
            position={[0, 0.5, -0.05]}
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
        
        {/* Office chair behind reception */}
        <group position={[-3, 0, -7]} rotation={[0, 0.5, 0]}>
          {/* Seat */}
          <Box 
            args={[0.6, 0.1, 0.6]} 
            position={[0, 0.5, 0]}
            castShadow
          >
            <meshStandardMaterial color="#222222" />
          </Box>
          {/* Back */}
          <Box 
            args={[0.6, 0.8, 0.1]} 
            position={[0, 1, -0.3]}
            castShadow
          >
            <meshStandardMaterial color="#222222" />
          </Box>
          {/* Base */}
          <Cylinder 
            args={[0.3, 0.4, 0.1, 16]} 
            position={[0, 0.1, 0]}
            castShadow
          >
            <meshStandardMaterial color="#444444" />
          </Cylinder>
          {/* Wheels */}
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = i * Math.PI * 2 / 5;
            return (
              <group key={`wheel-${i}`} position={[Math.sin(angle) * 0.3, 0, Math.cos(angle) * 0.3]}>
                <Cylinder 
                  args={[0.05, 0.05, 0.1, 8]} 
                  rotation={[Math.PI / 2, 0, 0]}
                  castShadow
                >
                  <meshStandardMaterial color="#111111" />
                </Cylinder>
              </group>
            );
          })}
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
        <Cylinder 
          args={[0.4, 0.4, 1.2, 16]} 
          position={[0, 1.5, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#a5d8ff" 
            transparent={true}
            opacity={0.7}
          />
        </Cylinder>
        {/* Spout */}
        <Box 
          args={[0.6, 0.3, 0.6]} 
          position={[0, 0.8, 0]}
          castShadow
        >
          <meshStandardMaterial color="#eeeeee" />
        </Box>
        {/* Water cups */}
        <Cylinder 
          args={[0.1, 0.07, 0.2, 16]} 
          position={[0.5, 0.9, 0.3]}
          castShadow
        >
          <meshStandardMaterial 
            color="#ffffff" 
            transparent={true}
            opacity={0.5}
          />
        </Cylinder>
        <Cylinder 
          args={[0.1, 0.07, 0.2, 16]} 
          position={[0.6, 0.9, 0.2]}
          castShadow
        >
          <meshStandardMaterial 
            color="#ffffff" 
            transparent={true}
            opacity={0.5}
          />
        </Cylinder>
      </group>
      
      {/* Office Plants */}
      {[
        [20, 0, -40] as [number, number, number],
        [-30, 0, 25] as [number, number, number],
        [40, 0, -20] as [number, number, number],
        [-15, 0, 40] as [number, number, number]
      ].map((position, index) => (
        <group key={`plant-${index}`} position={position}>
          {/* Pot */}
          <Cylinder 
            args={[0.6, 0.4, 1, 16]} 
            position={[0, 0.5, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#8b4513" />
          </Cylinder>
          {/* Plant base */}
          <Cylinder 
            args={[0.5, 0.5, 0.2, 16]} 
            position={[0, 1.1, 0]}
            castShadow
          >
            <meshStandardMaterial color="#2e8b57" />
          </Cylinder>
          {/* Plant leaves */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * Math.PI * 2 / 8;
            const height = 0.5 + Math.random() * 1;
            return (
              <Box 
                key={`leaf-${i}`}
                args={[0.2, height, 0.05]} 
                position={[
                  Math.sin(angle) * 0.3, 
                  1.1 + height / 2, 
                  Math.cos(angle) * 0.3
                ]}
                rotation={[0, angle, 0.3]}
                castShadow
              >
                <meshStandardMaterial color="#3cb371" />
              </Box>
            );
          })}
        </group>
      ))}
      
      {/* Cubicle Area */}
      <group position={[-20, 0, -20]}>
        {/* Cubicle walls */}
        {[
          // Row 1
          { pos: [0, 1.5, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [4, 1.5, 4] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [-4, 1.5, 4] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [0, 1.5, 8] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          
          // Row 2
          { pos: [10, 1.5, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [14, 1.5, 4] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [10, 1.5, 8] as [number, number, number], rot: [0, 0, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          
          // Connecting walls
          { pos: [5, 1.5, 0] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
          { pos: [5, 1.5, 8] as [number, number, number], rot: [0, Math.PI/2, 0] as [number, number, number], size: [8, 3, 0.2] as [number, number, number] },
        ].map((wall, i) => (
          <Box 
            key={`cubicle-wall-${i}`}
            args={wall.size} 
            position={wall.pos}
            rotation={wall.rot}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#a9a9a9" />
          </Box>
        ))}
        
        {/* Desks in cubicles */}
        {[
          [0, 0, 4] as [number, number, number],
          [10, 0, 4] as [number, number, number],
          [0, 0, -4] as [number, number, number],
          [10, 0, -4] as [number, number, number]
        ].map((position, index) => (
          <group key={`cubicle-desk-${index}`} position={position}>
            {/* Desk surface */}
            <Box 
              args={[6, 0.1, 2.5]} 
              position={[0, 0.75, 0]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color="#d2b48c" />
            </Box>
            {/* Desk legs */}
            <Box 
              args={[0.2, 0.75, 0.2]} 
              position={[2.8, 0.375, 1.1]}
              castShadow
            >
              <meshStandardMaterial color="#a0522d" />
            </Box>
            <Box 
              args={[0.2, 0.75, 0.2]} 
              position={[-2.8, 0.375, 1.1]}
              castShadow
            >
              <meshStandardMaterial color="#a0522d" />
            </Box>
            <Box 
              args={[0.2, 0.75, 0.2]} 
              position={[2.8, 0.375, -1.1]}
              castShadow
            >
              <meshStandardMaterial color="#a0522d" />
            </Box>
            <Box 
              args={[0.2, 0.75, 0.2]} 
              position={[-2.8, 0.375, -1.1]}
              castShadow
            >
              <meshStandardMaterial color="#a0522d" />
            </Box>
            
            {/* Computer on desk */}
            <group position={[0, 0.85, -0.5]} rotation={[0, Math.PI, 0]}>
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
                position={[0, 0.5, -0.05]}
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
            
            {/* Office chair */}
            <group position={[0, 0, 1.5]} rotation={[0, Math.PI, 0]}>
              {/* Seat */}
              <Box 
                args={[0.6, 0.1, 0.6]} 
                position={[0, 0.5, 0]}
                castShadow
              >
                <meshStandardMaterial color="#222222" />
              </Box>
              {/* Back */}
              <Box 
                args={[0.6, 0.8, 0.1]} 
                position={[0, 1, -0.3]}
                castShadow
              >
                <meshStandardMaterial color="#222222" />
              </Box>
              {/* Base */}
              <Cylinder 
                args={[0.3, 0.4, 0.1, 16]} 
                position={[0, 0.1, 0]}
                castShadow
              >
                <meshStandardMaterial color="#444444" />
              </Cylinder>
            </group>
          </group>
        ))}
      </group>
      
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
        
        {/* Chairs around table */}
        {[
          [0, 0, 2] as [number, number, number], 
          [2, 0, 2] as [number, number, number], 
          [4, 0, 2] as [number, number, number], 
          [-2, 0, 2] as [number, number, number], 
          [-4, 0, 2] as [number, number, number],
          [0, 0, -2] as [number, number, number], 
          [2, 0, -2] as [number, number, number], 
          [4, 0, -2] as [number, number, number], 
          [-2, 0, -2] as [number, number, number], 
          [-4, 0, -2] as [number, number, number]
        ].map((position, index) => (
          <group key={`conf-chair-${index}`} position={position} rotation={[0, position[2] > 0 ? Math.PI : 0, 0]}>
            {/* Seat */}
            <Box 
              args={[0.6, 0.1, 0.6]} 
              position={[0, 0.5, 0]}
              castShadow
            >
              <meshStandardMaterial color="#222222" />
            </Box>
            {/* Back */}
            <Box 
              args={[0.6, 0.8, 0.1]} 
              position={[0, 1, -0.3]}
              castShadow
            >
              <meshStandardMaterial color="#222222" />
            </Box>
            {/* Base */}
            <Cylinder 
              args={[0.3, 0.4, 0.1, 16]} 
              position={[0, 0.1, 0]}
              castShadow
            >
              <meshStandardMaterial color="#444444" />
            </Cylinder>
          </group>
        ))}
      </group>
      
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