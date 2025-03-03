'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Game component with no SSR
// This is necessary because Three.js requires the browser environment
const Game = dynamic(() => import('./Game'), { ssr: false });

export default function GameWrapper() {
  return <Game />;
} 