import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const moods = [
  {
    id: 'happy',
    emoji: '😊',
    label: 'Happy',
    description: "I'm feeling good!",
    color: 'bg-[#FFFBEB] text-[#D97706]',
    darkColor: 'dark:bg-amber-900/30 dark:text-amber-200',
    response: "That's lovely! Enjoy the little things that make you smile!",
  },
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm',
    description: "I feel peaceful.",
    color: 'bg-[#F0FDF4] text-[#059669]',
    darkColor: 'dark:bg-emerald-900/30 dark:text-emerald-200',
    response: "Take your time and enjoy this peaceful moment.",
  },
  {
    id: 'okay',
    emoji: '😐',
    label: 'Okay',
    description: "I'm feeling just okay.",
    color: 'bg-[#F8F9FF] text-[#64748B]',
    darkColor: 'dark:bg-slate-800 dark:text-slate-200',
    response: "It's okay to have an ordinary day. You're welcome here just as you are.",
  },
  {
    id: 'sad',
    emoji: '😔',
    label: 'Sad',
    description: "I feel a little low.",
    color: 'bg-[#F5F3FF] text-[#7C3AED]',
    darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-200',
    response: "It's okay to feel sad sometimes. Be gentle with yourself. You can talk to someone you trust if you'd like.",
  },
  {
    id: 'worried',
    emoji: '😟',
    label: 'Worried',
    description: "Something is on my mind.",
    color: 'bg-[#FFF1F2] text-[#E11D48]',
    darkColor: 'dark:bg-rose-900/30 dark:text-rose-200',
    response: "It's okay to feel worried. Take things one step at a time, and remember that you can ask someone you trust for support.",
  },
];

const BreathingExercise = ({ onClose }) => {
  const [phase, setPhase] = useState('Breathe In');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => prev === 'Breathe In' ? 'Breathe Out' : 'Breathe In');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-blue-50 dark:bg-indigo-900/20 p-8 rounded-[35px] border-2 border-blue-100 dark:border-indigo-800/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-200 dark:bg-indigo-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="h-full bg-blue-500 dark:bg-indigo-400"
        />
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-blue-600 dark:text-indigo-300">Calm Corner: Deep Breathing</h3>
        <button 
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col items-center gap-8 py-4">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.6, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="w-32 h-32 bg-blue-400/30 dark:bg-indigo-500/30 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute w-24 h-24 bg-blue-400/60 dark:bg-indigo-500/60 rounded-full"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute w-16 h-16 bg-blue-500 dark:bg-indigo-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-indigo-900/40"
          >
            <div className="w-8 h-8 bg-white/30 rounded-full" />
          </motion.div>
        </div>

        <div className="text-center z-10">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-blue-800 dark:text-indigo-200 h-10"
          >
            {phase}...
          </motion.p>
          <p className="text-blue-600/60 dark:text-indigo-400/60 font-bold mt-4">
            Follow the circles. Gently breathe in through your nose,<br/>and out through your mouth.
          </p>
        </div>
      </div>
    </div>
  );
};

const MoodTracker = ({ isOpen, onClose }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showCalmExercise, setShowCalmExercise] = useState(false);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSelectedMood(null);
      setShowCalmExercise(false);
    }
  }, [isOpen]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowCalmExercise(false);
  };

  const resetMood = () => {
    setSelectedMood(null);
    setShowCalmExercise(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020617]/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-white dark:bg-[#0F172A] rounded-[50px] shadow-2xl border border-blue-50 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl cursor-pointer z-10 hover:scale-110 active:scale-95 transition-all"
              aria-label="Close"
            >
              ✕
            </button>

            <div className="flex-1 overflow-y-auto p-10 md:p-16">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-indigo-900/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 -ml-20 -mb-20 opacity-50"></div>

              <div className="text-center mb-12">
                <motion.div 
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-block bg-blue-50 dark:bg-indigo-950 text-blue-600 dark:text-indigo-400 px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest mb-6"
                >
                  Daily Check-in
                </motion.div>
                <h2 className="text-5xl md:text-6xl font-black text-[#1E293B] dark:text-white mb-6 tracking-tighter">
                  How Are You Feeling Today?
                </h2>
                <p className="text-2xl text-[#64748B] dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
                  Every feeling is okay. Choose the one that feels like you today!
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!selectedMood ? (
                  <motion.div 
                    key="mood-selection"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
                  >
                    {moods.map((mood) => (
                      <button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood)}
                        className={`${mood.color} ${mood.darkColor} p-8 rounded-[40px] flex flex-col items-center text-center gap-4 transition-all hover:scale-105 active:scale-95 border-4 border-transparent hover:border-white dark:hover:border-slate-700 shadow-sm hover:shadow-xl cursor-pointer group`}
                        aria-label={`I feel ${mood.label}`}
                      >
                        <span className="text-6xl group-hover:rotate-12 transition-transform duration-300" role="img" aria-hidden="true">{mood.emoji}</span>
                        <div>
                          <span className="block text-2xl font-black uppercase tracking-tight mb-1">{mood.label}</span>
                          <span className="block text-sm font-bold opacity-70 leading-tight">{mood.description}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="mood-response"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-4"
                  >
                    <div className="text-[120px] mb-8 leading-none animate-bounce-slow">{selectedMood.emoji}</div>
                    <h3 className="text-4xl md:text-5xl font-black text-[#1E293B] dark:text-white mb-10 leading-[1.1] max-w-3xl mx-auto tracking-tight">
                      {selectedMood.response}
                    </h3>
                    
                    <div className="flex flex-wrap justify-center gap-6 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCalmExercise(true)}
                        className="bg-[#6BCB77] hover:bg-[#5bb866] text-white font-black py-5 px-10 rounded-full text-2xl shadow-[0_15px_30px_rgba(107,203,119,0.3)] transition-all cursor-pointer flex items-center gap-3"
                      >
                        <span>🧘</span> Try a Calming Activity
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetMood}
                        className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-2 border-transparent dark:border-slate-700 font-black py-5 px-10 rounded-full text-2xl shadow-lg transition-all cursor-pointer"
                      >
                        Change Mood
                      </motion.button>
                    </div>

                    <div className="mt-16 p-6 bg-blue-50/50 dark:bg-indigo-900/10 rounded-[30px] inline-flex items-center gap-4">
                      <span className="text-3xl">🤝</span>
                      <p className="text-xl text-blue-700 dark:text-indigo-300 font-bold">
                        Talking to a trusted adult is always okay when you need support.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showCalmExercise && (
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    className="mt-12"
                  >
                    <BreathingExercise onClose={() => setShowCalmExercise(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}} />
    </AnimatePresence>
  );
};

export default MoodTracker;
