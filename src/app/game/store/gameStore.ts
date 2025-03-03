import { create } from 'zustand';

interface GameState {
  lives: number;
  infectionCount: number;
  gameOver: boolean;
  
  // Actions
  decreaseLives: () => void;
  increaseInfectionCount: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  lives: 3,
  infectionCount: 0,
  gameOver: false,
  
  decreaseLives: () => set((state) => {
    const newLives = state.lives - 1;
    return {
      lives: newLives,
      gameOver: newLives <= 0
    };
  }),
  
  increaseInfectionCount: () => set((state) => ({
    infectionCount: state.infectionCount + 1
  })),
  
  resetGame: () => set({
    lives: 3,
    infectionCount: 0,
    gameOver: false
  })
})); 