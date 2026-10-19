import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LetterItem = ({ 
  letter, 
  isTarget, 
  onCorrect, 
  onWrong, 
  difficulty,
  disabled,
  isHinted
}) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'correct', 'wrong'
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    if (disabled || isRevealed) return;

    if (isTarget) {
      setStatus('correct');
      setIsRevealed(true);
      onCorrect(letter);
    } else {
      setStatus('wrong');
      onWrong(letter);
      // Reset status after animation
      setTimeout(() => setStatus('idle'), 500);
    }
  };

  // Animation variants based on difficulty
  const getFloatingAnimation = () => {
    if (difficulty === 1 && !isHinted) return {}; // Static for easy, unless hinted
    
    return {
      x: [0, Math.random() * 20 - 10, 0],
      y: [0, Math.random() * 20 - 10, 0],
      scale: isHinted ? [1, 1.2, 1] : 1,
      rotate: difficulty >= 4 ? [0, 90, 180, 270, 360] : [0, 5, -5, 0],
      transition: {
        duration: isHinted ? 1 : 4 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };
  };

  return (
    <motion.div
      animate={status === 'idle' ? getFloatingAnimation() : {}}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`
        relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center cursor-pointer select-none
        transition-all duration-300
      `}
    >
      <AnimatePresence>
        {(status === 'wrong') && (
          <motion.div
            initial={{ x: -5 }}
            animate={{ x: [5, -5, 5, -5, 0] }}
            className="absolute inset-0 bg-red-100 rounded-3xl opacity-50 z-0"
          />
        )}
        {(status === 'correct' || isHinted) && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1.2, 1] }}
            className={`absolute inset-0 rounded-full z-0 ${
              status === 'correct' ? 'bg-yellow-100 shadow-[0_0_30px_rgba(253,224,71,0.6)]' : 'bg-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.6)]'
            }`}
          />
        )}
      </AnimatePresence>

      <span className={`
        text-6xl md:text-8xl font-black transition-colors duration-300 relative z-10
        ${status === 'correct' ? 'text-yellow-600' : isHinted ? 'text-blue-500' : 'text-blue-800'}
        ${status === 'wrong' ? 'text-red-600' : ''}
        ${isRevealed ? 'opacity-100 scale-110' : 'opacity-100'}
      `}>
        {letter}
      </span>

      {/* Particle effect for correct tap */}
      {status === 'correct' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{ 
                scale: [0, 1, 0],
                x: Math.cos(i * 60 * Math.PI / 180) * 50,
                y: Math.sin(i * 60 * Math.PI / 180) * 50
              }}
              className="absolute w-4 h-4 text-yellow-400"
            >
              ⭐
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LetterItem;
