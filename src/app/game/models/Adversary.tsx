'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import { Group, Vector3, Box3, MathUtils } from 'three';
import { useGameStore } from '../store/gameStore';

interface SprayParticle {
  position: Vector3;
  velocity: Vector3;
  life: number;
}

interface AdversaryProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  movementSpeed?: number;
}

export const Adversary: React.FC<AdversaryProps> = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  movementSpeed = 0.05,
}) => {
  const groupRef = useRef<Group>(null);
  const sprayRef = useRef<Group>(null);
  const currentPosition = useRef(new Vector3(...position));
  const targetPosition = useRef(new Vector3(...position));
  const currentVelocity = useRef(new Vector3(0, 0, 0));
  const [isSpraying, setIsSpraying] = useState(false);
  const sprayTimer = useRef<NodeJS.Timeout | null>(null);
  const sprayParticles = useRef<SprayParticle[]>([]);
  const lastSprayTime = useRef(0);
  const sprayDirection = useRef(new Vector3(0, 0, -1));
  const lastHitTime = useRef(0);
  const hitCooldown = 2000; // 2 seconds cooldown between hits
  
  const { scene } = useThree();
  const decreaseLives = useGameStore((state) => state.decreaseLives);
  const gameOver = useGameStore((state) => state.gameOver);
  
  // Initialize spray particles
  useEffect(() => {
    // Create 20 spray particles with random offsets
    resetSprayParticles();
    
    return () => {
      if (sprayTimer.current) {
        clearTimeout(sprayTimer.current);
      }
    };
  }, []);
  
  const resetSprayParticles = () => {
    sprayParticles.current = Array.from({ length: 20 }, () => ({
      position: new Vector3(
        MathUtils.randFloatSpread(0.5),
        MathUtils.randFloatSpread(0.5),
        MathUtils.randFloatSpread(0.5)
      ),
      velocity: new Vector3(0, 0, -1).normalize().multiplyScalar(0.2 + Math.random() * 0.1),
      life: 1.0
    }));
  };
  
  // Function to start spraying
  const startSpraying = (mosquitoPosition: Vector3) => {
    setIsSpraying(true);
    
    // Calculate spray direction towards mosquito
    if (groupRef.current) {
      const adversaryPosition = new Vector3();
      groupRef.current.getWorldPosition(adversaryPosition);
      
      // Set spray direction towards mosquito
      sprayDirection.current = mosquitoPosition.clone().sub(adversaryPosition).normalize();
      
      // Update spray particle velocities to go towards mosquito
      sprayParticles.current.forEach(particle => {
        // Base direction towards mosquito with some randomness
        particle.velocity = sprayDirection.current.clone()
          .add(new Vector3(
            MathUtils.randFloatSpread(0.3),
            MathUtils.randFloatSpread(0.3),
            MathUtils.randFloatSpread(0.3)
          ))
          .normalize()
          .multiplyScalar(0.3 + Math.random() * 0.1);
      });
    }
    
    // Stop spraying after 2 seconds
    sprayTimer.current = setTimeout(() => {
      setIsSpraying(false);
      resetSprayParticles();
    }, 2000);
  };
  
  // Update adversary position and check for collisions
  useFrame((_, delta) => {
    if (!groupRef.current || gameOver) return;
    
    // Find mosquito every frame
    const mosquitoObj = scene.getObjectByName('mosquito');
    if (mosquitoObj) {
      const mosquitoPosition = new Vector3();
      mosquitoObj.getWorldPosition(mosquitoPosition);
      
      // Always set target to move towards mosquito
      targetPosition.current.copy(mosquitoPosition);
      
      // Get distance to mosquito
      const distanceToMosquito = currentPosition.current.distanceTo(mosquitoPosition);
      
      // Spray when close enough and not already spraying
      const currentTime = Date.now();
      if (distanceToMosquito < 5 && !isSpraying && currentTime - lastSprayTime.current > 3000) {
        startSpraying(mosquitoPosition);
        lastSprayTime.current = currentTime;
      }
    } else {
      // Random movement if no mosquito found
      if (Math.random() < 0.01) {
        targetPosition.current.set(
          MathUtils.randFloatSpread(20),
          1,
          MathUtils.randFloatSpread(20)
        );
      }
    }
    
    // Calculate direction to target
    const direction = targetPosition.current.clone().sub(currentPosition.current).normalize();
    
    // Update velocity with smooth acceleration
    currentVelocity.current.x = MathUtils.lerp(currentVelocity.current.x, direction.x * movementSpeed, 0.1);
    currentVelocity.current.z = MathUtils.lerp(currentVelocity.current.z, direction.z * movementSpeed, 0.1);
    
    // Calculate new position
    const newPosition = currentPosition.current.clone().add(
      new Vector3(
        currentVelocity.current.x * 60 * delta,
        0,
        currentVelocity.current.z * 60 * delta
      )
    );
    
    // Check for collisions with walls
    const adversaryBox = new Box3().setFromObject(groupRef.current);
    const walls = scene.children.filter(child => 
      child.name && (child.name.includes('wall') || child.name.includes('cubicle'))
    );
    
    let collision = false;
    for (const wall of walls) {
      const wallBox = new Box3().setFromObject(wall);
      if (wallBox.intersectsBox(adversaryBox)) {
        collision = true;
        break;
      }
    }
    
    // Only update position if no collision
    if (!collision) {
      currentPosition.current.copy(newPosition);
      groupRef.current.position.copy(currentPosition.current);
      
      // Rotate to face direction of movement
      if (direction.length() > 0.01) {
        const angle = Math.atan2(direction.x, direction.z);
        groupRef.current.rotation.y = angle;
      }
    } else {
      // Bounce off wall by reversing direction
      currentVelocity.current.negate();
      targetPosition.current.copy(currentPosition.current.clone().add(currentVelocity.current.clone().multiplyScalar(10)));
    }
    
    // Update spray particles
    if (isSpraying) {
      // Move spray particles in spray direction
      sprayParticles.current.forEach(particle => {
        particle.position.add(particle.velocity);
        particle.life -= delta * 0.5; // Decrease life over time
        
        // Check for collision with mosquito
        const mosquitoObj = scene.getObjectByName('mosquito');
        if (mosquitoObj) {
          const mosquitoPosition = new Vector3();
          mosquitoObj.getWorldPosition(mosquitoPosition);
          
          const particleWorldPos = particle.position.clone();
          if (sprayRef.current) {
            particleWorldPos.applyMatrix4(sprayRef.current.matrixWorld);
          }
          
          // If particle hits mosquito, decrease lives with cooldown
          const currentTime = Date.now();
          if (particleWorldPos.distanceTo(mosquitoPosition) < 0.8 && 
              particle.life > 0.5 && 
              currentTime - lastHitTime.current > hitCooldown) {
            decreaseLives();
            lastHitTime.current = currentTime;
            
            // Remove all active particles after a hit to prevent multiple hits
            sprayParticles.current.forEach(p => {
              p.life = 0;
            });
          }
        }
      });
      
      // Reset dead particles
      sprayParticles.current = sprayParticles.current.filter(p => p.life > 0);
    }
  });
  
  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]} scale={scale}>
      {/* Body - changed to a dress/pencil skirt shape */}
      <Box args={[0.6, 1.0, 0.4]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Pencil Skirt */}
      <Box args={[0.5, 0.8, 0.35]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      
      {/* Head */}
      <Sphere args={[0.3, 16, 16]} position={[0, 2.1, 0]}>
        <meshStandardMaterial color="#f5f5f4" />
      </Sphere>
      
      {/* Blonde Hair */}
      <group position={[0, 2.1, 0]}>
        <Sphere args={[0.32, 16, 16]} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#f0c674" />
        </Sphere>
        {/* Hair details */}
        <Box args={[0.64, 0.2, 0.64]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#f0c674" />
        </Box>
      </group>
      
      {/* Arms */}
      <Box args={[0.2, 0.6, 0.2]} position={[0.5, 1.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      <Box args={[0.2, 0.6, 0.2]} position={[-0.5, 1.3, 0]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Legs */}
      <Box args={[0.2, 0.6, 0.2]} position={[0.15, 0.2, 0]}>
        <meshStandardMaterial color="#f5f5f4" />
      </Box>
      
      <Box args={[0.2, 0.6, 0.2]} position={[-0.15, 0.2, 0]}>
        <meshStandardMaterial color="#f5f5f4" />
      </Box>
      
      {/* Spray can */}
      <group ref={sprayRef} position={[0.6, 1.5, 0.3]} rotation={[0, 0, Math.PI / 4]}>
        <Cylinder args={[0.1, 0.1, 0.4, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ef4444" />
        </Cylinder>
        
        <Cylinder args={[0.05, 0.1, 0.1, 16]} position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Cylinder>
        
        {/* Spray particles - only visible when spraying */}
        {isSpraying && sprayParticles.current.map((particle, i) => (
          <group key={`spray-${i}`} position={[particle.position.x, particle.position.y, particle.position.z]}>
            <Sphere
              args={[0.02, 8, 8]}
            >
              <meshStandardMaterial 
                color="#a0ffa0" 
                transparent={true}
                opacity={particle.life}
              />
            </Sphere>
          </group>
        ))}
      </group>
    </group>
  );
}; 