import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Modal } from '@/components/ui';
import speechService from '@/utils/speech';
import useLetterDetectiveStore from '@/store/useLetterDetectiveStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Components
import DetectiveMascot from './DetectiveMascot';
import LetterGrid from './LetterGrid';

const STORAGE_KEYS = {
  SPEECH_RATE: 'letter_detective_speech_rate',
  SPEECH_VOICE: 'letter_detective_speech_voice'
};

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
    setLevel,
    resetGame: resetStoreGame
  } = useLetterDetectiveStore();

  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'word-connection', 'round-complete'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [hintTimestamp, setHintTimestamp] = useState(0);
  const [isHintUsed, setIsHintUsed] = useState(false);

  // Audio Settings
  const [speechRate, setSpeechRate] = useLocalStorage(STORAGE_KEYS.SPEECH_RATE, 0.85);
  const [speechVoice, setSpeechVoice] = useLocalStorage(STORAGE_KEYS.SPEECH_VOICE, null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  // Audio Settings unmount cleanup
  useEffect(() => {
    return () => speechService.stop();
  }, []);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechService.getAvailableVoices();
      setAvailableVoices(voices);
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
    speechService.speak("Here is one!", {
      rate: speechRate,
      voice: speechVoice
    });
    
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
      rate: speechRate,
      voice: speechVoice,
      onEnd: () => setIsSpeaking(false)
    });
  }, [currentPair, speechRate, speechVoice]);

  useEffect(() => {
    if (gameState === 'playing' && currentPair) {
      speakInstructions();
    }
    return () => speechService.stop();
  }, [gameState, currentPair, speakInstructions]);

  useEffect(() => {
    if (isGameComplete && gameState === 'playing') {
      setGameState('word-connection');
      const text = `${currentPair.target} is for ${currentPair.example}. Can you say ${currentPair.example}?`;
      setSpeechText(text);
      setIsSpeaking(true);
      speechService.speak(text, {
        rate: speechRate,
        voice: speechVoice,
        onEnd: () => setIsSpeaking(false)
      });
    }
    return () => speechService.stop();
  }, [isGameComplete, gameState, currentPair, speechRate, speechVoice]);

  const handleCorrect = (letter) => {
    incrementFoundCount();
    speechService.speak(`Great! That's ${letter}!`, {
      rate: speechRate,
      voice: speechVoice
    });
  };

  const handleWrong = (letter) => {
    logMistake(currentPair.target, letter);
    speechService.speak(`That's ${letter}. Try again!`, {
      rate: speechRate,
      voice: speechVoice
    });
  };

  const handleNextRound = () => {
    setIsHintUsed(false);
    startNewRound();
    setGameState('playing');
  };

  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      resetStoreGame();
      setGameState('intro');
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-green-400 dark:from-slate-900 dark:to-[#020617] flex flex-col p-4 md:p-8 font-sans text-blue-900 dark:text-blue-100 transition-colors duration-300">
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 md:p-6 rounded-[32px] shadow-xl mb-8 border-b-4 border-blue-100 dark:border-slate-800 transition-colors relative z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-2xl text-2xl shadow-inner">🔍</div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-blue-900 dark:text-blue-100">Letter Detective</h1>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-blue-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  animate={{ width: `${(targetFoundCount / totalTargetsInRound) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-blue-400 dark:text-blue-500">{targetFoundCount}/{totalTargetsInRound}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 px-4 py-2 rounded-2xl font-black text-yellow-900 shadow-sm flex items-center gap-2">
            ⭐ {score}
          </div>
          <Button 
            variant="ghost"
            onClick={() => setIsSettingsOpen(true)}
            className="text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors p-2"
          >
            ⚙️
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate('/games')}
            className="text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
            <button 
              onClick={speakInstructions}
              disabled={isSpeaking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800 py-6 rounded-2xl flex items-center justify-center gap-3 font-black text-lg shadow-lg disabled:opacity-50"
            >
              <span>🔊</span> REPEAT
            </button>
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl text-center border-2 border-white/20 dark:border-slate-700 backdrop-blur-sm transition-colors">
              <p className="text-sm font-bold opacity-70 text-blue-900 dark:text-blue-200 uppercase tracking-widest">DIFFICULTY</p>
              <div className="flex justify-center gap-2 mt-2">
                {[1, 2, 3, 4].map(l => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`w-8 h-8 rounded-lg font-bold transition-all ${level === l ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white/50 dark:bg-slate-700 text-blue-400 dark:text-blue-300'}`}
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
                className="w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-white dark:border-slate-800 transition-colors"
              >
                <div className="text-9xl mb-8">🕵️‍♀️</div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-900 dark:text-blue-100 mb-4 tracking-tight">Are you ready?</h2>
                <p className="text-xl text-blue-600 dark:text-blue-300 mb-12 font-medium max-w-md">Help us find the missing letters and become a Super Detective!</p>
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
                className="w-full h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-blue-400 dark:border-blue-500 transition-colors"
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
                <h2 className="text-6xl font-black text-blue-900 dark:text-blue-100 mb-4">{currentPair?.example}</h2>
                <p className="text-2xl text-blue-600 dark:text-blue-300 mb-12 font-medium">
                  <span className="text-5xl text-blue-800 dark:text-blue-100 font-black">{currentPair?.target}</span> is for <span className="font-bold">{currentPair?.example}</span>
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
                className="w-full h-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[48px] shadow-2xl flex flex-col items-center justify-center text-center p-12 border-4 border-yellow-400 transition-colors"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-9xl mb-8"
                >
                  🏆
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-900 dark:text-blue-100 mb-4">Mission Complete!</h2>
                <p className="text-xl text-blue-600 dark:text-blue-300 mb-8 font-medium">You found all the {currentPair?.target} letters!</p>
                
                <div className="bg-yellow-100 dark:bg-yellow-900/20 p-6 rounded-3xl mb-12 flex items-center gap-6 border-2 border-yellow-200 dark:border-yellow-800">
                  <div className="text-5xl">🎁</div>
                  <div className="text-left">
                    <p className="font-black text-yellow-700 dark:text-yellow-400 text-2xl">New Badge Earned!</p>
                    <p className="text-yellow-600 dark:text-yellow-500 font-bold">Super Letter Detective</p>
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
                  <div className="bg-white/90 dark:bg-slate-900/90 px-8 py-4 rounded-3xl shadow-lg border-b-4 border-blue-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                    <p className="font-black text-2xl uppercase tracking-tighter text-blue-900 dark:text-blue-100">
                      Find all the <span className="text-blue-600 dark:text-blue-400 text-4xl mx-2">"{currentPair?.target}"</span> letters!
                    </p>
                    <div className="flex gap-2">
                      {/* Hint Button */}
                      <button 
                        onClick={handleHint}
                        disabled={isHintUsed}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all shadow-sm border-b-2 
                          ${isHintUsed 
                            ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 border-gray-200 dark:border-slate-700 cursor-not-allowed opacity-50' 
                            : 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'}`}
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

                  <div className="bg-blue-900/10 dark:bg-blue-100/10 backdrop-blur-sm p-4 rounded-3xl text-center font-black text-blue-900/40 dark:text-blue-100/40 uppercase tracking-widest text-sm transition-colors">
                    Tap the correct letters to catch them!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-500/20 to-transparent dark:from-slate-900 pointer-events-none -z-10" />
      <div className="fixed -bottom-10 -left-10 w-40 h-40 bg-green-300 dark:bg-green-900 rounded-full blur-3xl opacity-50 dark:opacity-20 -z-10" />
      <div className="fixed -top-10 -right-10 w-60 h-60 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-30 dark:opacity-10 -z-10" />

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="GAME SETTINGS">
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Audio Speed</label>
              <span className="bg-blue-600 px-4 py-1 rounded-full text-sm font-black text-white">{speechRate.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.05" 
              value={speechRate} 
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))} 
              className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
            <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase text-gray-500 dark:text-white">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Voice Accent</label>
            <select 
              value={speechVoice || ''} 
              onChange={(e) => setSpeechVoice(e.target.value)} 
              className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl p-4 text-gray-900 dark:text-white font-bold outline-none focus:border-blue-500 appearance-none"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default (Indian English)</option>
              {availableVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
          
          <Button 
            onClick={() => { speechService.speak("Testing audio", { rate: speechRate, voice: speechVoice }); }} 
            className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-blue-600 dark:text-white border border-gray-200 dark:border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            🔊 TEST AUDIO
          </Button>
          
          <Button 
            onClick={resetGame} 
            className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold"
          >
            🔄 RESET PROGRESS
          </Button>
          
          <Button 
            onClick={() => setIsSettingsOpen(false)} 
            className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl"
          >
            SAVE & CLOSE
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default LetterDetective;
