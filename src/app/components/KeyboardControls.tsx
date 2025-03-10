'use client';

import { ReactNode } from 'react';
import { KeyboardControls as DreiKeyboardControls } from '@react-three/drei';
import { controlKeys } from '../game/hooks/useFirstPersonControls';

interface KeyboardControlsProps {
  children: ReactNode;
}

export default function KeyboardControls({ children }: KeyboardControlsProps) {
  // Map our control keys to the format expected by @react-three/drei
  const controls = [
    { name: 'forward', keys: [controlKeys.forward] },
    { name: 'backward', keys: [controlKeys.backward] },
    // Removed left/right controls as mouse will handle turning
  ];

  return (
    <DreiKeyboardControls map={controls}>
      {children}
    </DreiKeyboardControls>
  );
} 