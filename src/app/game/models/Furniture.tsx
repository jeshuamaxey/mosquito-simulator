'use client';

import { Box, Cylinder } from '@react-three/drei';

// Define furniture types
export interface DeskConfig {
  position: [number, number, number];
  rotation: [number, number, number];
}

// Completely revised desk configurations to avoid all wall intersections
export const deskConfigurations = [
  // Row 1 - along the left wall (moved further inward)
  { position: [-35, 0, -30], rotation: [0, Math.PI / 2, 0] },
  { position: [-35, 0, -20], rotation: [0, Math.PI / 2, 0] },
  { position: [-35, 0, -10], rotation: [0, Math.PI / 2, 0] },
  { position: [-35, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { position: [-35, 0, 10], rotation: [0, Math.PI / 2, 0] },
  
  // Row 2 - along the right wall (moved further inward)
  { position: [35, 0, -30], rotation: [0, -Math.PI / 2, 0] },
  { position: [35, 0, -20], rotation: [0, -Math.PI / 2, 0] },
  { position: [35, 0, -10], rotation: [0, -Math.PI / 2, 0] },
  { position: [35, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { position: [35, 0, 10], rotation: [0, -Math.PI / 2, 0] },
  
  // Central area - repositioned to avoid cubicle walls
  // Cluster 1 (moved to clear area)
  { position: [-20, 0, -35], rotation: [0, 0, 0] },
  { position: [-20, 0, -30], rotation: [0, 0, 0] },
  { position: [-15, 0, -35], rotation: [0, 0, 0] },
  { position: [-15, 0, -30], rotation: [0, 0, 0] },
  
  // Cluster 2 (moved to clear area)
  { position: [20, 0, -35], rotation: [0, 0, 0] },
  { position: [20, 0, -30], rotation: [0, 0, 0] },
  { position: [15, 0, -35], rotation: [0, 0, 0] },
  { position: [15, 0, -30], rotation: [0, 0, 0] },
  
  // Cluster 3 - middle area (repositioned)
  { position: [-8, 0, -5], rotation: [0, Math.PI, 0] },
  { position: [8, 0, -5], rotation: [0, 0, 0] },
  { position: [-8, 0, 5], rotation: [0, Math.PI, 0] },
  { position: [8, 0, 5], rotation: [0, 0, 0] },
  
  // Executive desks - back area (repositioned)
  { position: [-25, 0, 20], rotation: [0, Math.PI / 4, 0] },
  { position: [25, 0, 20], rotation: [0, -Math.PI / 4, 0] },
  
  // Reception area (moved further away from reception desk)
  { position: [0, 0, 25], rotation: [0, Math.PI, 0] },
];

// Updated plant positions to avoid all intersections
export const plantPositions = [
  [-40, 0, -40],  // Corner plant
  [40, 0, -40],   // Corner plant
  [40, 0, 40],    // Corner plant
  [-40, 0, 40],   // Corner plant
  [-20, 0, 0],    // Divider plant
  [20, 0, 0],     // Divider plant
  [0, 0, -40],    // Center back wall
  [0, 0, 15],     // Near reception
  [-30, 0, 15],   // Executive area
  [30, 0, 15],    // Executive area
];

// Render a desk with computer
export function Desk({ position, rotation }: DeskConfig) {
  return (
    <group position={position} rotation={rotation}>
      {/* Desk */}
      <Box 
        args={[2, 0.1, 1]} 
        position={[0, 0.75, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#5c3c2e" />
      </Box>
      
      {/* Desk legs */}
      <Box 
        args={[0.1, 0.75, 0.1]} 
        position={[0.8, 0.375, 0.4]}
        castShadow
      >
        <meshStandardMaterial color="#4a3121" />
      </Box>
      <Box 
        args={[0.1, 0.75, 0.1]} 
        position={[-0.8, 0.375, 0.4]}
        castShadow
      >
        <meshStandardMaterial color="#4a3121" />
      </Box>
      <Box 
        args={[0.1, 0.75, 0.1]} 
        position={[0.8, 0.375, -0.4]}
        castShadow
      >
        <meshStandardMaterial color="#4a3121" />
      </Box>
      <Box 
        args={[0.1, 0.75, 0.1]} 
        position={[-0.8, 0.375, -0.4]}
        castShadow
      >
        <meshStandardMaterial color="#4a3121" />
      </Box>
      
      {/* Computer monitor */}
      <Box 
        args={[0.8, 0.5, 0.1]} 
        position={[0, 1.25, -0.3]}
        castShadow
      >
        <meshStandardMaterial color="#333333" />
      </Box>
      <Box 
        args={[0.7, 0.4, 0.05]} 
        position={[0, 1.25, -0.27]}
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
        args={[0.1, 0.2, 0.1]} 
        position={[0, 0.95, -0.3]}
        castShadow
      >
        <meshStandardMaterial color="#555555" />
      </Box>
      
      {/* Keyboard */}
      <Box 
        args={[0.6, 0.05, 0.2]} 
        position={[0, 0.8, 0]}
        castShadow
      >
        <meshStandardMaterial color="#222222" />
      </Box>
      
      {/* Office chair - positioned on the opposite side of the desk from the monitor */}
      <group position={[0, 0, 1.2]}>
        {/* Chair seat */}
        <Box 
          args={[0.6, 0.1, 0.6]} 
          position={[0, 0.5, 0]}
          castShadow
        >
          <meshStandardMaterial color="#333333" />
        </Box>
        
        {/* Chair back - facing toward the desk */}
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
        
        {/* Chair wheels */}
        {Array.from({ length: 5 }).map((_, i) => {
          const angle = i * Math.PI * 2 / 5;
          return (
            <group key={`wheel-${i}`} position={[Math.sin(angle) * 0.25, 0.1, Math.cos(angle) * 0.25]}>
              <Cylinder 
                args={[0.05, 0.05, 0.05, 8]} 
                rotation={[Math.PI/2, 0, 0]}
                castShadow
              >
                <meshStandardMaterial color="#222222" />
              </Cylinder>
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Render a plant
export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
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
  );
} 