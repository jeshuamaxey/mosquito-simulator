'use client';

import { useGameStore } from '../game/store/gameStore';
import { useEffect, useState } from 'react';

export default function HUD() {
  const { lives, infectionCount, gameOver, resetGame } = useGameStore();
  const [animateInfection, setAnimateInfection] = useState(false);
  const [prevInfectionCount, setPrevInfectionCount] = useState(infectionCount);
  
  // Detect changes in infection count to trigger animation
  useEffect(() => {
    if (infectionCount > prevInfectionCount) {
      setAnimateInfection(true);
      const timer = setTimeout(() => {
        setAnimateInfection(false);
      }, 1000); // Animation duration
      
      setPrevInfectionCount(infectionCount);
      return () => clearTimeout(timer);
    }
  }, [infectionCount, prevInfectionCount]);

  return (
    <div id="game-hud" style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '80%', maxWidth: '900px', zIndex: 9999 }}>
      {/* Game stats - styled as a capsule with rounded ends */}
      <div style={{ 
        height: '140px',
        borderRadius: '70px',
        background: 'linear-gradient(to bottom, rgba(20, 80, 180, 0.8), rgba(0, 30, 100, 0.6))',
        boxShadow: '0 0 20px rgba(0, 150, 255, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)',
        border: '2px solid rgba(100, 200, 255, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
        backdropFilter: 'blur(5px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glossy highlight effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0))',
          borderRadius: '70px 70px 0 0',
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          width: '100%',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Lives counter - integrated with the HUD */}
          <div style={{ 
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(40, 120, 220, 0.4) 0%, rgba(20, 80, 180, 0) 70%)',
            padding: '15px 30px',
            borderRadius: '50px',
            boxShadow: 'inset 0 0 20px rgba(100, 200, 255, 0.3)'
          }}>
            <div style={{ 
              fontSize: '3.2rem', 
              fontWeight: 'bold', 
              marginBottom: '5px',
              textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
              ❤️ {lives}
            </div>
            <div style={{ 
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>Lives</div>
          </div>
          
          {/* Camera Mode Indicator - in the middle */}
          <div style={{ 
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(40, 120, 220, 0.4) 0%, rgba(20, 80, 180, 0) 70%)',
            padding: '15px 30px',
            borderRadius: '50px',
            boxShadow: 'inset 0 0 20px rgba(100, 200, 255, 0.3)',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px'
          }}>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 'bold', 
              marginBottom: '5px',
              textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
              📷 <span id="camera-mode">First Person</span>
            </div>
            <div style={{ 
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>Press 1 or 2 to switch</div>
            <div style={{ 
              fontSize: '0.7rem',
              marginTop: '5px',
              opacity: 0.8,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>Walls & ceiling enforced</div>
          </div>
          
          {/* Infection counter - integrated with the HUD */}
          <div style={{ 
            textAlign: 'center',
            background: 'radial-gradient(circle, rgba(40, 120, 220, 0.4) 0%, rgba(20, 80, 180, 0) 70%)',
            padding: '15px 30px',
            borderRadius: '50px',
            boxShadow: 'inset 0 0 20px rgba(100, 200, 255, 0.3)'
          }}>
            <div className={animateInfection ? 'infection-pulse' : ''} 
                 style={{ 
                   fontSize: '3.5rem', 
                   fontWeight: 'bold', 
                   marginBottom: '5px',
                   textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
                 }}>
              🦟 {infectionCount}
            </div>
            <div style={{ 
              fontSize: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}>Infections</div>
          </div>
        </div>
        
        {/* Center divider line with glow - removed to make space for camera mode indicator */}
      </div>
      
      {/* Game over screen */}
      {gameOver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(20, 80, 180, 0.9) 0%, rgba(0, 20, 80, 0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            fontSize: '4.5rem', 
            color: 'white', 
            marginBottom: '20px', 
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(100, 200, 255, 0.8), 0 5px 15px rgba(0, 0, 0, 0.5)'
          }}>
            Game Over
          </h2>
          <p style={{ 
            fontSize: '2.2rem', 
            color: 'white', 
            marginBottom: '40px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            You infected {infectionCount} people!
          </p>
          <button 
            style={{
              background: 'linear-gradient(to bottom, rgba(100, 200, 255, 0.9), rgba(30, 100, 200, 0.9))',
              color: 'white',
              padding: '20px 40px',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), inset 0 2px 3px rgba(255, 255, 255, 0.6)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={resetGame}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {/* Button highlight effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0))',
              borderRadius: '50px 50px 0 0',
              pointerEvents: 'none'
            }}></div>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 