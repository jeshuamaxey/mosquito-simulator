'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import { Group, Vector3, Box3, Object3D } from 'three';
import { useGameStore } from '../store/gameStore';

// Define a set of outfit colors for variety
const OUTFIT_COLORS = {
  shirts: [
    "#3273a8", // Blue
    "#327a32", // Green
    "#7a3232", // Red
    "#7a7a32", // Yellow
    "#7a3278", // Purple
    "#327a7a", // Teal
    "#4d4d4d", // Gray
    "#5e3b1e", // Brown
  ],
  pants: [
    "#1e4258", // Dark blue
    "#1e4229", // Dark green
    "#421e1e", // Dark red
    "#424229", // Dark yellow
    "#421e42", // Dark purple
    "#1e4242", // Dark teal
    "#2e2e2e", // Dark gray
    "#3e2814", // Dark brown
  ],
  skin: [
    "#f9c9a3", // Light skin
    "#e6b388", // Medium light skin
    "#c99b71", // Medium skin
    "#a67c52", // Medium dark skin
    "#7c5c3c", // Dark skin
  ]
};

interface HumanProps {
  position: [number, number, number];
  scale?: number;
  walkSpeed?: number;
  outfitIndex?: number;
}

export default function Human({ 
  position, 
  scale = 1, 
  walkSpeed = 0.5,
  outfitIndex = -1, // -1 means random outfit
}: HumanProps) {
  const groupRef = useRef<Group>(null);
  const [infected, setInfected] = useState(false);
  const [walkDirection, setWalkDirection] = useState(Math.random() * Math.PI * 2);
  const [walkTime, setWalkTime] = useState(0);
  const [changeDirectionTime, setChangeDirectionTime] = useState(
    Math.random() * 2 + 2
  );
  
  // Current position and velocity
  const currentPosition = useRef(new Vector3(position[0], position[1], position[2]));
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  
  // Randomly select outfit colors if not specified
  const [outfitColors] = useState(() => {
    const index = outfitIndex >= 0 ? outfitIndex % OUTFIT_COLORS.shirts.length : Math.floor(Math.random() * OUTFIT_COLORS.shirts.length);
    const skinIndex = Math.floor(Math.random() * OUTFIT_COLORS.skin.length);
    
    return {
      shirt: OUTFIT_COLORS.shirts[index],
      pants: OUTFIT_COLORS.pants[index],
      skin: OUTFIT_COLORS.skin[skinIndex]
    };
  });
  
  const { increaseInfectionCount } = useGameStore();
  const { scene } = useThree();
  
  // Handle infection
  const handleInfection = () => {
    if (!infected) {
      setInfected(true);
      increaseInfectionCount();
    }
  };
  
  // Check if a position is valid (not inside a wall)
  const isValidPosition = (pos: Vector3): boolean => {
    const humanSize = 0.3; // Approximate size of human
    const humanBox = new Box3();
    humanBox.min.set(
      pos.x - humanSize,
      pos.y,
      pos.z - humanSize
    );
    humanBox.max.set(
      pos.x + humanSize,
      pos.y + 1.5, // Human height
      pos.z + humanSize
    );
    
    // Find all walls in the scene
    const walls: Object3D[] = [];
    scene.traverse((object) => {
      if (object.name.includes('cubicle-wall') || 
          (object.position.y > 1 && 
           (Math.abs(object.position.x) > 45 || Math.abs(object.position.z) > 45))) {
        walls.push(object);
      }
    });
    
    // Check for collisions with walls
    for (const wall of walls) {
      const wallBox = new Box3().setFromObject(wall);
      if (humanBox.intersectsBox(wallBox)) {
        return false;
      }
    }
    
    return true;
  };
  
  // Find a valid position near the initial position
  const findValidPosition = (pos: Vector3): Vector3 => {
    // If the initial position is valid, use it
    if (isValidPosition(pos)) {
      return pos;
    }
    
    // Try positions in increasing distance from the original
    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    
    for (let distance = 0.5; distance <= 5; distance += 0.5) {
      for (const [dx, dz] of directions) {
        const testPos = new Vector3(
          pos.x + dx * distance,
          pos.y,
          pos.z + dz * distance
        );
        
        if (isValidPosition(testPos)) {
          return testPos;
        }
      }
    }
    
    // If no valid position found, return a position in the center area
    return new Vector3(
      Math.random() * 10 - 5,
      pos.y,
      Math.random() * 10 - 5
    );
  };
  
  // Initialize position on mount
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Wait a frame for the scene to be fully loaded
    const timer = setTimeout(() => {
      const validPosition = findValidPosition(currentPosition.current);
      currentPosition.current.copy(validPosition);
      
      if (groupRef.current) {
        groupRef.current.position.copy(validPosition);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set userData for identification
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.isHuman = true;
      groupRef.current.userData.infected = infected;
    }
  }, [infected]);
  
  // Update userData when infected state changes
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.infected = infected;
    }
  }, [infected]);
  
  // Improved walking animation with wall collision detection
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    // Update walk time
    setWalkTime(prev => prev + delta);
    
    // Change direction randomly or when colliding with a wall
    if (walkTime > changeDirectionTime) {
      setWalkDirection(Math.random() * Math.PI * 2);
      setChangeDirectionTime(Math.random() * 2 + 2);
      setWalkTime(0);
    }
    
    // Calculate movement direction
    const moveX = Math.sin(walkDirection) * walkSpeed * delta;
    const moveZ = Math.cos(walkDirection) * walkSpeed * delta;
    
    // Update velocity with smooth acceleration
    currentVelocity.current.x = moveX;
    currentVelocity.current.z = moveZ;
    
    // Calculate new position
    const newPosition = new Vector3(
      currentPosition.current.x + currentVelocity.current.x,
      currentPosition.current.y,
      currentPosition.current.z + currentVelocity.current.z
    );
    
    // Check for wall collisions
    const humanSize = 0.3; // Approximate size of human
    const humanBox = new Box3();
    humanBox.min.set(
      newPosition.x - humanSize,
      newPosition.y,
      newPosition.z - humanSize
    );
    humanBox.max.set(
      newPosition.x + humanSize,
      newPosition.y + 1.5, // Human height
      newPosition.z + humanSize
    );
    
    // Find all walls in the scene
    const walls: Object3D[] = [];
    scene.traverse((object) => {
      // Check if this is a wall by looking for a name that includes 'wall'
      if (object.name.includes('cubicle-wall') || 
          (object.position.y > 1 && // Main outer walls are positioned higher
           (Math.abs(object.position.x) > 45 || Math.abs(object.position.z) > 45))) {
        walls.push(object);
      }
    });
    
    let collision = false;
    
    // Check for collisions with walls
    for (const wall of walls) {
      const wallBox = new Box3().setFromObject(wall);
      
      if (humanBox.intersectsBox(wallBox)) {
        collision = true;
        
        // Bounce off the wall by reversing direction
        setWalkDirection(walkDirection + Math.PI + (Math.random() * 0.5 - 0.25));
        setWalkTime(0);
        break;
      }
    }
    
    // Check for world boundaries
    const WORLD_BOUNDS = {
      minX: -49,
      maxX: 49,
      minZ: -49,
      maxZ: 49
    };
    
    if (newPosition.x < WORLD_BOUNDS.minX || newPosition.x > WORLD_BOUNDS.maxX ||
        newPosition.z < WORLD_BOUNDS.minZ || newPosition.z > WORLD_BOUNDS.maxZ) {
      collision = true;
      
      // Bounce off the boundary by reversing direction
      setWalkDirection(walkDirection + Math.PI + (Math.random() * 0.5 - 0.25));
      setWalkTime(0);
    }
    
    // Only update position if no collision
    if (!collision) {
      currentPosition.current.copy(newPosition);
      
      // Update the group position
      groupRef.current.position.copy(currentPosition.current);
    }
    
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
          color={infected ? "#a83232" : outfitColors.shirt} 
        />
      </Cylinder>
      
      {/* Head */}
      <Box 
        args={[0.25, 0.25, 0.25]} 
        position={[0, 1.15, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : outfitColors.skin} 
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
          color={infected ? "#a83232" : outfitColors.shirt} 
        />
      </Cylinder>
      <Cylinder 
        args={[0.05, 0.05, 0.6, 8]} 
        position={[-0.3, 0.6, 0]} 
        rotation={[0, 0, Math.PI / 3]}
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : outfitColors.shirt} 
        />
      </Cylinder>
      
      {/* Legs */}
      <Cylinder 
        args={[0.07, 0.07, 0.5, 8]} 
        position={[0.1, 0.05, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : outfitColors.pants} 
        />
      </Cylinder>
      <Cylinder 
        args={[0.07, 0.07, 0.5, 8]} 
        position={[-0.1, 0.05, 0]} 
        castShadow
      >
        <meshStandardMaterial 
          color={infected ? "#a83232" : outfitColors.pants} 
        />
      </Cylinder>
    </group>
  );
} 