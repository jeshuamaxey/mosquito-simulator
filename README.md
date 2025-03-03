# Mosquito Simulator

A first-person mosquito simulation game built with Next.js, React, and Three.js.

## Description

In Mosquito Simulator, you play as a mosquito flying through a low-poly 3D environment. Your objective is to infect as many humans as possible while avoiding dangers. The game features:

- First-person mosquito flight mechanics
- Low-poly "Web 3G" aesthetic
- Realistic mosquito-like movement with random flight patterns
- Humans to infect
- HUD showing lives and infection count

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/mosquito-simulator.git
cd mosquito-simulator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## How to Play

- **WASD**: Move forward, left, backward, right
- **Space**: Fly up
- **Shift**: Fly down
- **Mouse**: Look around
- **Click**: Infect humans (when close enough)

The game starts with 3 lives. Your objective is to infect as many humans as possible.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Three.js](https://threejs.org/) - 3D library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [Zustand](https://github.com/pmndrs/zustand) - State management

## Future Enhancements

- Add sound effects
- Add more environments
- Add more obstacles and challenges
- Add a scoring system
- Add different types of humans with varying difficulty
- Add power-ups

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the life of a mosquito
- Thanks to the React Three Fiber community for the amazing tools
