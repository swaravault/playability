import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DetectiveMascot = ({ speechText, isSpeaking }) => {
  return (
    <div className="flex flex-col items-center gap-4 relative">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {speechText && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 bg-white text-blue-900 p-4 rounded-3xl shadow-xl min-w-[200px] text-center border-4 border-blue-100 z-10"
          >
            <p className="font-bold text-lg leading-tight">{speechText}</p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-blue-100 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Container */}
      <motion.div
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 0.5 }
        } : {
          y: [0, -10, 0],
          transition: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }}
        className="w-48 h-48 relative"
      >
        {/* Placeholder for Detective Image */}
        <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-8xl shadow-2xl border-8 border-white overflow-hidden">
          <span role="img" aria-label="detective">🕵️‍♀️</span>
        </div>
        
        {/* Magnifying Glass Overlay */}
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            x: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -bottom-2 -right-2 text-6xl drop-shadow-lg"
        >
          🔍
        </motion.div>
      </motion.div>

      {/* Name Tag */}
      <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest shadow-lg">
        Detective Sky
      </div>
    </div>
  );
};

export default DetectiveMascot;
