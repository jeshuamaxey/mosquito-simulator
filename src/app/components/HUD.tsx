'use client';

import { useGameStore } from '../game/store/gameStore';

export default function HUD() {
  const { lives, infectionCount, gameOver, resetGame } = useGameStore();

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      {/* Game stats */}
      <div className="flex justify-between items-center">
        <div className="bg-black/50 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">❤️</span>
          <span>{lives}</span>
        </div>
        
        <div className="bg-black/50 text-white px-4 py-2 rounded-lg flex items-center">
          <span className="mr-2">🦟</span>
          <span>Infections: {infectionCount}</span>
        </div>
      </div>
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 pointer-events-auto">
          <h2 className="text-4xl text-white mb-4">Game Over</h2>
          <p className="text-xl text-white mb-8">You infected {infectionCount} people!</p>
          <button 
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            onClick={resetGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 