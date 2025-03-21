'use client';

// Define the wall type
export interface WallConfig {
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number, number];
}

// Update cubicle wall configurations to avoid desk intersections
export const cubicleWalls = [
  // Outer walls - moved inward to avoid intersections with desks
  { 
    pos: [-30, 1.5, 0], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 60] 
  },
  { 
    pos: [30, 1.5, 0], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 60] 
  },
  { 
    pos: [0, 1.5, -30], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 60] 
  },
  
  // Central dividers - repositioned to avoid desk clusters
  { 
    pos: [0, 1.5, 0], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 40] 
  },
  { 
    pos: [0, 1.5, 0], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 40] 
  },
  
  // Smaller dividers - adjusted to create clear pathways
  { 
    pos: [-15, 1.5, -15], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [15, 1.5, -15], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [-15, 1.5, 15], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [15, 1.5, 15], 
    rot: [0, 0, 0], 
    size: [0.2, 3, 10] 
  },
  
  // Corner dividers - repositioned to create office spaces
  { 
    pos: [-15, 1.5, -15], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [15, 1.5, -15], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [-15, 1.5, 15], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 10] 
  },
  { 
    pos: [15, 1.5, 15], 
    rot: [0, Math.PI/2, 0], 
    size: [0.2, 3, 10] 
  },
];

// Create a maze-like office layout with cubicle walls
export const cubicleWallsOriginal: WallConfig[] = [
  // Main corridors - horizontal
  { pos: [0, 1.5, -30], rot: [0, 0, 0], size: [80, 3, 0.2] },
  { pos: [0, 1.5, -10], rot: [0, 0, 0], size: [80, 3, 0.2] },
  { pos: [0, 1.5, 10], rot: [0, 0, 0], size: [80, 3, 0.2] },
  { pos: [0, 1.5, 30], rot: [0, 0, 0], size: [80, 3, 0.2] },
  
  // Main corridors - vertical
  { pos: [-30, 1.5, 0], rot: [0, Math.PI/2, 0], size: [80, 3, 0.2] },
  { pos: [-10, 1.5, 0], rot: [0, Math.PI/2, 0], size: [80, 3, 0.2] },
  { pos: [10, 1.5, 0], rot: [0, Math.PI/2, 0], size: [80, 3, 0.2] },
  { pos: [30, 1.5, 0], rot: [0, Math.PI/2, 0], size: [80, 3, 0.2] },
  
  // Cubicle sections - Quadrant 1 (top right)
  { pos: [15, 1.5, 15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [25, 1.5, 15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [20, 1.5, 20], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [20, 1.5, 25], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [15, 1.5, 25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [25, 1.5, 25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  
  // Cubicle sections - Quadrant 2 (top left)
  { pos: [-15, 1.5, 15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-25, 1.5, 15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-20, 1.5, 20], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [-20, 1.5, 25], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [-15, 1.5, 25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-25, 1.5, 25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  
  // Cubicle sections - Quadrant 3 (bottom left)
  { pos: [-15, 1.5, -15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-25, 1.5, -15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-20, 1.5, -20], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [-20, 1.5, -25], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [-15, 1.5, -25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [-25, 1.5, -25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  
  // Cubicle sections - Quadrant 4 (bottom right)
  { pos: [15, 1.5, -15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [25, 1.5, -15], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [20, 1.5, -20], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [20, 1.5, -25], rot: [0, Math.PI/2, 0], size: [10, 3, 0.2] },
  { pos: [15, 1.5, -25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  { pos: [25, 1.5, -25], rot: [0, 0, 0], size: [10, 3, 0.2] },
  
  // Additional maze elements
  { pos: [35, 1.5, 35], rot: [0, 0, 0], size: [20, 3, 0.2] },
  { pos: [35, 1.5, -35], rot: [0, 0, 0], size: [20, 3, 0.2] },
  { pos: [-35, 1.5, 35], rot: [0, 0, 0], size: [20, 3, 0.2] },
  { pos: [-35, 1.5, -35], rot: [0, 0, 0], size: [20, 3, 0.2] },
  { pos: [35, 1.5, 0], rot: [0, Math.PI/2, 0], size: [20, 3, 0.2] },
  { pos: [-35, 1.5, 0], rot: [0, Math.PI/2, 0], size: [20, 3, 0.2] },
  { pos: [0, 1.5, 35], rot: [0, Math.PI/2, 0], size: [20, 3, 0.2] },
  { pos: [0, 1.5, -35], rot: [0, Math.PI/2, 0], size: [20, 3, 0.2] },
]; 