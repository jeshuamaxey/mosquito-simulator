import { create } from 'zustand';

interface GameState {
  lives: number;
  infectionCount: number;
  gameOver: boolean;
  humanCount: number;
  
  // Actions
  decreaseLives: () => void;
  increaseInfectionCount: () => void;
  increaseHumanCount: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  lives: 3,
  infectionCount: 0,
  gameOver: false,
  humanCount: 10,
  
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
  
  increaseHumanCount: () => set((state) => {
    // Increase by 1-3 humans at a time, up to a maximum of 50
    const increase = Math.floor(Math.random() * 3) + 1;
    const newCount = Math.min(state.humanCount + increase, 50);
    return {
      humanCount: newCount
    };
  }),
  
  resetGame: () => set({
    lives: 3,
    infectionCount: 0,
    gameOver: false,
    humanCount: 10
  })
})); 