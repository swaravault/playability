import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui';

const ASSETS_PATH = '/assets/games/ling-six/';
const LING_SOUNDS = [
  { id: 'm', label: 'm', file: 'm.m4a' },
  { id: 'ah', label: 'ah', file: 'ah.m4a' },
  { id: 'oo', label: 'oo', file: 'oo.m4a' },
  { id: 'ee', label: 'ee', file: 'ee.m4a' },
  { id: 'sh', label: 'sh', file: 'sh.m4a' },
  { id: 's', label: 's', file: 's.m4a' },
];

const LingSixGame = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'feedback', 'won'
  const [currentSound, setCurrentSound] = useState(null);
  const [remainingSounds, setRemainingSounds] = useState([...LING_SOUNDS]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  const [lastClickedId, setLastClickedId] = useState(null);
  const [audioError, setAudioError] = useState(false);
  
  const audioRef = useRef(null);

  const playSound = useCallback((file) => {
    if (audioRef.current) {
      setAudioError(false);
      audioRef.current.pause();
      audioRef.current.src = `${ASSETS_PATH}${file}`;
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setAudioError(true);
      });
    }
  }, []);

  const startNextRound = useCallback((availableSounds) => {
    if (availableSounds.length === 0) {
      setGameState('won');
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableSounds.length);
    const sound = availableSounds[randomIndex];
    
    setCurrentSound(sound);
    setAttempts(0);
    setFeedback(null);
    setLastClickedId(null);
    
    // Play sound after a short delay
    setTimeout(() => {
      playSound(sound.file);
    }, 500);
  }, [playSound]);

  const startGame = useCallback(() => {
    setScore(0);
    setRemainingSounds([...LING_SOUNDS]);
    setGameState('playing');
    startNextRound([...LING_SOUNDS]);
  }, [startNextRound]);

  const startNewGame = useCallback(() => {
    setGameState('start');
  }, []);

  const handleGuess = (soundId) => {
    if (gameState !== 'playing' || feedback === 'correct') return;

    setLastClickedId(soundId);
    const isCorrect = soundId === currentSound.id;
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);

    if (isCorrect) {
      setFeedback('correct');
      
      // Calculate score
      let points = 0;
      if (currentAttempts === 1) points = 10;
      else if (currentAttempts === 2) points = 5;
      
      setScore(prev => prev + points);

      // Remove from remaining
      const nextRemaining = remainingSounds.filter(s => s.id !== currentSound.id);
      setRemainingSounds(nextRemaining);

      // Advance after delay
      setTimeout(() => {
        if (nextRemaining.length === 0) {
          setGameState('won');
        } else {
          startNextRound(nextRemaining);
        }
      }, 2000);
    } else {
      setFeedback('wrong');
      // Reset feedback after a delay to allow another try
      setTimeout(() => {
        setFeedback(null);
        setLastClickedId(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] dark:bg-[#020617] p-4 md:p-8 flex flex-col items-center overflow-x-hidden font-sans transition-colors duration-300">
      <audio ref={audioRef} />
      
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 md:p-12 border-b-8 border-blue-200 dark:border-blue-900 text-left relative z-10 transition-colors duration-300">
        
        <header className="flex justify-between items-center mb-8 border-b-4 border-dashed border-blue-100 dark:border-slate-800 pb-6">
          <div className="flex flex-col">
            <h1 className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">Ling Six Test</h1>
            <div className="mt-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-1 rounded-full inline-block border border-blue-200 dark:border-blue-800">
              <span className="text-blue-800 dark:text-blue-200 font-bold">Score: {score}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-2xl font-bold h-14 px-6 border-2 border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => window.history.back()}
          >
            ⬅️ GO BACK
          </Button>
        </header>

        {gameState === 'start' ? (
          <div className="flex flex-col items-center py-12">
            <div className="text-9xl mb-8 animate-bounce">👂</div>
            <h2 className="text-4xl font-black text-gray-800 dark:text-slate-100 mb-6 text-center">Ready to test your ears?</h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 mb-12 text-center max-w-md">
              We will play 6 different sounds. Listen carefully and click the matching button!
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-10 px-20 rounded-[40px] text-4xl shadow-2xl transform active:scale-95 transition-all"
              onClick={startGame}
            >
              START TEST 🚀
            </Button>
          </div>
        ) : gameState === 'won' ? (
          <div className="flex flex-col items-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="text-9xl mb-6">🏆</div>
            <h2 className="text-7xl font-black text-green-600 dark:text-green-400 mb-4 text-center leading-none">TEST COMPLETE!</h2>
            <p className="text-3xl font-bold text-gray-700 dark:text-slate-200 mb-4 text-center">Your Final Score: {score}</p>
            <p className="text-xl text-gray-500 dark:text-slate-400 mb-12 text-center">Excellent listening skills!</p>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-black py-10 px-16 rounded-[40px] text-4xl shadow-2xl transform active:scale-95 transition-all animate-bounce"
              onClick={startNewGame}
            >
              PLAY AGAIN 🚀
            </Button>

            <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
               <div className="absolute top-10 left-1/4 animate-bounce text-6xl">🎉</div>
               <div className="absolute top-1/3 right-1/4 animate-bounce text-6xl" style={{ animationDelay: '0.2s' }}>✨</div>
               <div className="absolute bottom-1/3 left-1/2 animate-bounce text-6xl" style={{ animationDelay: '0.4s' }}>🌟</div>
               <div className="absolute bottom-10 right-10 animate-bounce text-6xl" style={{ animationDelay: '0.6s' }}>🥳</div>
            </div>
          </div>
        ) : (
          <>
            {/* Audio Control Area */}
            <div className="mb-10 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border-2 border-blue-100 dark:border-blue-800 flex flex-col items-center shadow-inner transition-colors">
               <p className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-6 uppercase tracking-wider">
                 Listen carefully to the sound...
               </p>
               <Button 
                 onClick={() => currentSound && playSound(currentSound.file)}
                 className="bg-blue-500 hover:bg-blue-600 text-white w-24 h-24 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all"
               >
                 <span className="text-4xl">🔊</span>
               </Button>
               <p className="mt-4 text-sm font-bold text-blue-400 dark:text-blue-500">Click to replay</p>
               {audioError && (
                 <p className="mt-2 text-red-500 text-sm font-bold animate-pulse text-center">
                   ⚠️ Audio failed to play. <br/>
                   Check files in: <code className="bg-red-50 dark:bg-red-900/20 px-1 rounded">public/assets/games/ling-six/</code>
                 </p>
               )}
            </div>

            {/* Feedback Message Area */}
            <div className="h-28 flex items-center justify-center mb-10">
              {feedback === 'wrong' && (
                <div className="bg-red-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl animate-shake shadow-2xl border-b-8 border-red-700">
                  Try again, you can do it! 💪
                </div>
              )}
              {feedback === 'correct' && (
                <div className="bg-green-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl animate-pulse shadow-2xl border-b-8 border-green-700 text-center">
                  Great! ✨<br/>
                  <span className="text-xl">+{attempts === 1 ? 10 : 5} Points</span>
                </div>
              )}
              {!feedback && (
                <div className="text-blue-400 dark:text-blue-500 font-black text-2xl tracking-widest uppercase opacity-70 bg-blue-50 dark:bg-blue-900/20 px-8 py-2 rounded-full border border-blue-100 dark:border-blue-800">
                  Which sound was it?
                </div>
              )}
            </div>

            {/* Sound Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {LING_SOUNDS.map((sound, idx) => {
                const isSelected = lastClickedId === sound.id;
                const isCorrect = feedback === 'correct' && sound.id === currentSound.id;
                const isCurrentWrong = feedback === 'wrong' && lastClickedId === sound.id;
                const isAlreadyDone = !remainingSounds.find(s => s.id === sound.id) && !isCorrect;

                // Color palette
                const colors = [
                  'bg-orange-500 border-orange-700',
                  'bg-blue-500 border-blue-700',
                  'bg-pink-500 border-pink-700',
                  'bg-green-500 border-green-700',
                  'bg-purple-500 border-purple-700',
                  'bg-yellow-500 border-yellow-700'
                ];
                const buttonColor = colors[idx % colors.length];

                return (
                  <Button
                    key={sound.id}
                    disabled={isAlreadyDone || feedback === 'correct'}
                    onClick={() => handleGuess(sound.id)}
                    className={`
                      h-32 text-5xl font-black rounded-[35px] transition-all shadow-xl transform tracking-widest uppercase border-b-8 text-white
                      ${isAlreadyDone 
                        ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 border-gray-300 dark:border-slate-700 opacity-50 cursor-not-allowed shadow-none' 
                        : isCorrect
                          ? 'bg-green-500 border-green-700 scale-105 shadow-green-200'
                          : isCurrentWrong
                            ? 'bg-red-600 animate-shake border-red-800 shadow-red-200 translate-y-1'
                            : `${buttonColor} hover:brightness-110 active:translate-y-1 active:shadow-none`
                      }
                    `}
                  >
                    {sound.label}
                  </Button>
                );
              })}
            </div>
            
            <div className="mt-8 text-center text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest text-sm">
              Sounds tested: {6 - remainingSounds.length} / 6
            </div>
          </>
        )}
      </div>

      {/* Decorative Visual-First Footer */}
      <div className="mt-12 flex gap-10 opacity-80 z-0">
        <span className="text-6xl animate-pulse">👂</span>
        <span className="text-6xl">🎵</span>
        <span className="text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
        <span className="text-6xl">👂</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-15px); }
          40% { transform: translateX(15px); }
          60% { transform: translateX(-15px); }
          80% { transform: translateX(15px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default LingSixGame;
