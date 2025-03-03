'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartDialogProps {
  onStart: () => void;
}

export default function StartDialog({ onStart }: StartDialogProps) {
  const [visible, setVisible] = useState(true);
  const [clickable, setClickable] = useState(false);

  const handleClick = () => {
    if (!clickable) return;
    
    setVisible(false);
    setTimeout(() => {
      onStart();
    }, 500); // Wait for fade animation to complete
  };

  // Add event listener for clicks after a short delay
  useEffect(() => {
    // Set clickable to true after a short delay to prevent accidental clicks
    const clickableTimer = setTimeout(() => {
      setClickable(true);
    }, 500);
    
    if (visible) {
      window.addEventListener('click', handleClick);
      window.addEventListener('touchstart', handleClick);
    }

    return () => {
      clearTimeout(clickableTimer);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: visible ? 'auto' : 'none'
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(5px)'
            }}
            onClick={handleClick}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              position: 'relative',
              width: '90%',
              maxWidth: '600px',
              padding: '40px',
              borderRadius: '30px',
              background: 'linear-gradient(to bottom, rgba(20, 80, 180, 0.8), rgba(0, 30, 100, 0.6))',
              boxShadow: '0 0 30px rgba(0, 150, 255, 0.6), inset 0 0 30px rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(100, 200, 255, 0.5)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            {/* Glossy highlight effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0))',
              borderRadius: '30px 30px 0 0',
              pointerEvents: 'none'
            }}></div>
            
            <h2 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: 'white',
              textShadow: '0 0 15px rgba(100, 200, 255, 0.8), 0 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
              Mosquito Game
            </h2>
            
            <p style={{ 
              fontSize: '1.5rem', 
              marginBottom: '30px',
              color: 'white',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
            }}>
              Fly around as a mosquito and infect humans!
            </p>
            
            <div style={{ 
              fontSize: '1.2rem', 
              marginBottom: '30px',
              color: 'white',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              background: 'radial-gradient(circle, rgba(40, 120, 220, 0.4) 0%, rgba(20, 80, 180, 0) 70%)',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: 'inset 0 0 20px rgba(100, 200, 255, 0.3)'
            }}>
              <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Controls:</p>
              <p style={{ marginBottom: '5px' }}>W, A, S, D - Move</p>
              <p style={{ marginBottom: '5px' }}>Mouse - Look around</p>
              <p style={{ marginBottom: '5px' }}>Click - Infect humans</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              style={{
                background: 'linear-gradient(to bottom, rgba(100, 200, 255, 0.9), rgba(30, 100, 200, 0.9))',
                color: 'white',
                padding: '15px 40px',
                fontSize: '1.5rem',
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
              Click to Start
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 