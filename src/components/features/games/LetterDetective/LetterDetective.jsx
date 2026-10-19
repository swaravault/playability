import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import speechService from '@/utils/speech';
import useLetterDetectiveStore from '@/store/useLetterDetectiveStore';

// Components
import DetectiveMascot from './DetectiveMascot';
import LetterGrid from './LetterGrid';

const LetterDetective = () => {
  const navigate = useNavigate();
  const {
    level,
    currentPair,
    targetFoundCount,
    totalTargetsInRound,
    isGameComplete,
    score,
    startNewRound,
    incrementFoundCount,
    logMistake,
    setLevel
  } = useLetterDetectiveStore();

  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'word-connection', 'round-complete'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [hintTimestamp, setHintTimestamp] = useState(0);
  const [isHintUsed, setIsHintUsed] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!currentPair) {
      startNewRound();
      setIsHintUsed(false);
    }
  }, [currentPair, startNewRound]);

  const handleHint = () => {
    if (isHintUsed) return;
    setHintTimestamp(Date.now());
    setIsHintUsed(true);
    speechService.speak("Here is one!");
    
    // Clear hint timestamp after usage period
    setTimeout(() => {
      setHintTimestamp(0);
    }, 2500);
  };

  const speakInstructions = useCallback(() => {
    if (!currentPair) return;
    
    const text = `Find all the letters ${currentPair.target}. ${currentPair.target} for ${currentPair.example}.`;
    setSpeechText(text);
    setIsSpeaking(true);
    speechService.speak(text, {
      onEnd: () => setIsSpeaking(false)
    });
  }, [currentPair]);

  useEffect(() => {
    if (gameState === 'playing' && currentPair) {
      speakInstructions();
    }
  }, [gameState, currentPair, speakInstructions]);

  useEffect(() => {
    if (isGameComplete && gameState === 'playing') {
      setGameState('word-connection');
      const text = `${currentPair.target} is for ${currentPair.example}. Can you say ${currentPair.example}?`;
      setSpeechText(text);
      setIsSpeaking(true);
      speechService.speak(text, {
        onEnd: () => setIsSpeaking(false)
      });
    }
  }, [isGameComplete, gameState, currentPair]);

  const handleCorrect = (letter) => {
    incrementFoundCount();
    speechService.speak(`Great! That's ${letter}!`);
  };

  const handleWrong = (letter) => {
    logMistake(currentPair.target, letter);
    speechService.speak(`That's ${letter}. Try again!`);
  };

  const handleNextRound = () => {
    setIsHintUsed(false);
    startNewRound();
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-400 flex flex-col p-4 md:p-8 font-sans text-blue-900">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-[32px] shadow-xl mb-8 border-b-4 border-blue-100">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-2xl text-2xl shadow-inner">🔍</div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-blue-900">Letter Detective</h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-blue-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  animate={{ width: `${(targetFoundCount / totalTargetsInRound) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-blue-400">{targetFoundCount}/{totalTargetsInRound}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 px-4 py-2 rounded-2xl font-black text-yellow-900 shadow-sm flex items-center gap-2">
            ⭐ {score}
          </div>
          <Button 
            variant="ghost"
            onClick={() => navigate('/games')}
            className="text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
          >
            QUIT
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left: Mascot and Instructions */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center lg:justify-start pt-12">
          <DetectiveMascot 
            speechText={speechText} 
            isSpeaking={isSpeaking}
          />
          
          <div className="mt-12 w-full space-y-4">
            <Button 
              onClick={speakInstructions}
              disabled={isSpeaking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 py-6 rounded-2xl flex items-center justify-center gap-3 font-black text-lg"
            >
              <span>🔊</span> REPEAT
            </Button>
            <div className="bg-white/50 p-4 rounded-2xl text-center border-2 border-white/20">
              <p className="text-sm font-bold opacity-70">DIFFICULTY</p>
              <div className="flex justify-center gap-2 mt-2">
                {[1, 2, 3, 4].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`w-8 h-8 rounded-lg font-bold transition-all ${level === l ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white/50 text-blue-400'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Grid */}
        <div className="lg:col-span-3 h-[500px] md:h-[600px]">
          <AnimatePresence mode="wait">
            {gameState === 'intro' ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full h-full bg-white/80 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-white"
              >
                <div className="text-9xl mb-8">🕵️‍♀️</div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4">Are you ready?</h2>
                <p className="text-xl text-blue-600 mb-12 font-medium max-w-md">Help us find the missing letters and become a Super Detective!</p>
                <Button 
                  onClick={() => setGameState('playing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black py-10 px-20 rounded-[40px] shadow-2xl transform transition-all active:scale-95"
                >
                  START MISSION 🚀
                </Button>
              </motion.div>
            ) : gameState === 'word-connection' ? (
              <motion.div
                key="word-connection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-blue-400"
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-9xl mb-8"
                >
                  {currentPair?.target === 'b' ? '⚽' : 
                   currentPair?.target === 'd' ? '🐶' :
                   currentPair?.target === 'm' ? '🌙' :
                   currentPair?.target === 'n' && currentPair?.example === 'Nose' ? '👃' :
                   currentPair?.target === 'n' ? '🌃' : // Night
                   currentPair?.target === 'q' ? '👸' :
                   currentPair?.target === 'p' ? '🐷' :
                   currentPair?.target === 'u' && currentPair?.example === 'Umbrella' ? '☂️' :
                   currentPair?.target === 'u' ? '⬆️' : // Up
                   currentPair?.target === 'v' ? '🚐' :
                   currentPair?.target === 't' ? '🐯' :
                   currentPair?.target === 'f' ? '🐟' :
                   currentPair?.target === 'i' ? '❄️' :
                   currentPair?.target === 'j' ? '🍯' :
                   currentPair?.target === 'a' ? '🍎' :
                   currentPair?.target === 'o' ? '🍊' :
                   currentPair?.target === 'c' ? '🐱' :
                   currentPair?.target === 'e' ? '🥚' : '📦'}
                </motion.div>
                <h2 className="text-6xl font-black text-blue-900 mb-4">{currentPair?.example}</h2>
                <p className="text-2xl text-blue-600 mb-12 font-medium">
                  <span className="text-5xl text-blue-800 font-black">{currentPair?.target}</span> is for <span className="font-bold">{currentPair?.example}</span>
                </p>
                
                <Button 
                  onClick={() => setGameState('round-complete')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl"
                >
                  CONTINUE ➡️
                </Button>
              </motion.div>
            ) : gameState === 'round-complete' ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-white/90 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-yellow-400"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-9xl mb-8"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4">Mission Complete!</h2>
                <p className="text-xl text-blue-600 mb-8 font-medium">You found all the {currentPair?.target} letters!</p>
                
                <div className="bg-yellow-100 p-6 rounded-3xl mb-12 flex items-center gap-6">
                  <div className="text-5xl">🎁</div>
                  <div className="text-left">
                    <p className="font-black text-yellow-700 text-2xl">New Badge Earned!</p>
                    <p className="text-yellow-600 font-bold">Super Letter Detective</p>
                  </div>
                </div>

                <Button 
                  onClick={handleNextRound}
                  className="bg-green-500 hover:bg-green-600 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl"
                >
                  NEXT MISSION ➡️
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full h-full"
              >
                <div className="h-full flex flex-col gap-4">
                  <div className="bg-white/90 px-8 py-4 rounded-3xl shadow-lg border-b-4 border-blue-100 flex justify-between items-center">
                    <p className="font-black text-2xl uppercase tracking-tighter text-blue-900">
                      Find all the <span className="text-blue-600 text-4xl mx-2">"{currentPair?.target}"</span> letters!
                    </p>
                    <div className="flex gap-2">
                      {/* Hint Button */}
                      <button 
                        onClick={handleHint}
                        disabled={isHintUsed}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm border-b-2 
                          ${isHintUsed 
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50' 
                            : 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300'}`}
                      >
                        💡
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <LetterGrid 
                      targetLetter={currentPair?.target}
                      distractorLetter={currentPair?.distractor}
                      totalTargets={totalTargetsInRound}
                      difficulty={level}
                      onCorrect={handleCorrect}
                      onWrong={handleWrong}
                      isComplete={isGameComplete}
                      hintTimestamp={hintTimestamp}
                    />
                  </div>

                  <div className="bg-blue-900/10 backdrop-blur-sm p-4 rounded-3xl text-center font-black text-blue-900/40 uppercase tracking-widest text-sm">
                    Tap the correct letters to catch them!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-500/20 to-transparent pointer-events-none -z-10" />
      <div className="fixed -bottom-10 -left-10 w-40 h-40 bg-green-300 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="fixed -top-10 -right-10 w-60 h-60 bg-blue-300 rounded-full blur-3xl opacity-30 -z-10" />
    </div>
  );
};

export default LetterDetective;
