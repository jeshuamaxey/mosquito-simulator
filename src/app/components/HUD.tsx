'use client';

import { useGameStore } from '../game/store/gameStore';
import { useEffect, useState } from 'react';

export default function HUD() {
  const { lives, infectionCount, gameOver, resetGame } = useGameStore();
  const [animateInfection, setAnimateInfection] = useState(false);
  const [prevInfectionCount, setPrevInfectionCount] = useState(infectionCount);
  const [prevLives, setPrevLives] = useState(lives);
  const [showDamageOverlay, setShowDamageOverlay] = useState(false);
  
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
  
  // Detect changes in lives to trigger damage animation
  useEffect(() => {
    if (lives < prevLives) {
      // Show damage overlay
      setShowDamageOverlay(true);
      
      // Hide damage overlay after animation completes
      const timer = setTimeout(() => {
        setShowDamageOverlay(false);
      }, 1500); // Duration for the overlay to be visible
      
      setPrevLives(lives);
      return () => clearTimeout(timer);
    }
  }, [lives, prevLives]);

  // Add keyboard listener for "R" key to restart the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver && e.code === 'KeyR') {
        resetGame();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver, resetGame]);

  return (
    <>
      {/* Damage overlay - red flash when hit - moved outside the HUD container */}
      {showDamageOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          pointerEvents: 'none',
          zIndex: 9998,
          animation: 'redFlash 1.5s forwards',
          mixBlendMode: 'multiply'
        }} />
      )}
      
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
                textShadow: '0 2px 5px rgba(0, 0, 0, 0.5)',
                animation: showDamageOverlay ? 'pulse 0.5s' : 'none'
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
        
        {/* Add CSS animations */}
        <style jsx global>{`
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); color: #ff3030; text-shadow: 0 0 15px rgba(255, 0, 0, 0.8); }
            100% { transform: scale(1); }
          }
          
          @keyframes redFlash {
            0% { opacity: 0; }
            10% { opacity: 0.8; }
            20% { opacity: 0.6; }
            30% { opacity: 0.8; }
            40% { opacity: 0.6; }
            50% { opacity: 0.7; }
            100% { opacity: 0; }
          }
          
          .infection-pulse {
            animation: pulse 0.5s;
          }
        `}</style>
      </div>
      
      {/* Game over screen */}
      {gameOver && (
        <>
          {/* Grey overlay to block interaction with the game */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px) grayscale(100%)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} />
          
          {/* Game over modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '600px',
            background: 'radial-gradient(circle, rgba(20, 80, 180, 0.95) 0%, rgba(0, 20, 80, 0.98) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(100, 200, 255, 0.2)',
            border: '2px solid rgba(100, 200, 255, 0.3)'
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
                overflow: 'hidden',
                marginBottom: '20px'
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
            
            {/* Press R to restart instruction */}
            <p style={{ 
              fontSize: '1.5rem', 
              color: 'white',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              background: 'rgba(0, 50, 150, 0.5)',
              padding: '10px 25px',
              borderRadius: '25px',
              boxShadow: 'inset 0 0 10px rgba(100, 200, 255, 0.3)'
            }}>
              Press <span style={{ 
                fontWeight: 'bold', 
                color: '#a0e0ff',
                textShadow: '0 0 10px rgba(160, 224, 255, 0.8)'
              }}>R</span> to restart
            </p>
          </div>
        </>
      )}
    </>
  );
} 