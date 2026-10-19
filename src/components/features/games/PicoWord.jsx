import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui';

// Using consistent path for public assets
const ASSETS_PATH = '/assets/games/game-01/';

const GAME_ITEMS = [
  { name: 'apple', ext: 'png' },
  { name: 'ball', ext: 'jpg' },
  { name: 'banana', ext: 'jpg' },
  { name: 'bird', ext: 'png' },
  { name: 'car', ext: 'jpg' },
  { name: 'cat', ext: 'jpg' },
  { name: 'dog', ext: 'jpg' },
  { name: 'elephant', ext: 'png' },
  { name: 'fish', ext: 'jpg' },
  { name: 'flower', ext: 'png' },
  { name: 'nose', ext: 'png' },
  { name: 'star', ext: 'jpg' },
  { name: 'sun', ext: 'png' },
  { name: 'tree', ext: 'png' },
];

const PicoWord = () => {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won'
  const [targetPics, setTargetPics] = useState([]);
  const [jumbledWords, setJumbledWords] = useState([]);
  const [selections, setSelections] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  const [lastClickedIndex, setLastClickedIndex] = useState(-1);

  const startNewGame = useCallback(() => {
    // Pick 4 random items
    const shuffled = [...GAME_ITEMS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    // Jumble the words
    const words = selected.map(item => item.name);
    const jumbled = [...words].sort(() => 0.5 - Math.random());
    
    setTargetPics(selected);
    setJumbledWords(jumbled);
    setSelections([]);
    setFeedback(null);
    setGameState('playing');
    setLastClickedIndex(-1);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleWordClick = (word, index) => {
    if (gameState !== 'playing' || selections.includes(index) || feedback === 'wrong') return;

    const nextCorrectWord = targetPics[selections.length].name;

    if (word === nextCorrectWord) {
      const newSelections = [...selections, index];
      setSelections(newSelections);
      setFeedback('correct');
      setLastClickedIndex(index);
      
      setTimeout(() => setFeedback(null), 500);

      if (newSelections.length === 4) {
        setGameState('won');
      }
    } else {
      setFeedback('wrong');
      setLastClickedIndex(index);
      setTimeout(() => {
        setFeedback(null);
        setSelections([]);
        setLastClickedIndex(-1);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] dark:bg-[#020617] p-4 md:p-8 flex flex-col items-center overflow-x-hidden transition-colors duration-300">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl p-8 md:p-12 border-b-8 border-purple-200 dark:border-purple-900 text-left relative z-10 transition-colors duration-300">
        
        <header className="flex justify-between items-center mb-8 border-b-4 border-dashed border-purple-100 dark:border-slate-800 pb-6">
          <h1 className="text-5xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">PicoWord</h1>
          <Button 
            variant="outline" 
            className="rounded-2xl font-bold h-14 px-6 border-2 border-purple-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => window.history.back()}
          >
            ⬅️ GO BACK
          </Button>
        </header>

        {gameState === 'won' ? (
          <div className="flex flex-col items-center py-12 animate-in fade-in zoom-in duration-500">
            <div className="text-9xl mb-6">🎊</div>
            <h2 className="text-7xl font-black text-green-600 dark:text-green-400 mb-4 text-center leading-none">GOOD JOB!</h2>
            <p className="text-3xl font-bold text-gray-700 dark:text-slate-300 mb-12 text-center">You matched them all perfectly!</p>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-black py-10 px-16 rounded-[40px] text-4xl shadow-2xl transform active:scale-95 transition-all animate-bounce"
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
            {/* Instruction Area */}
            <div className="mb-10 p-6 bg-purple-100 dark:bg-purple-900/30 rounded-3xl border-2 border-purple-200 dark:border-purple-800 shadow-inner">
               <p className="text-2xl font-black text-purple-800 dark:text-purple-200 tracking-wide uppercase">
                 Tap the words in the same order as the pictures! 🎨
               </p>
            </div>

            {/* Pictures Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {targetPics.map((item, idx) => {
                const isMatched = selections.length > idx;
                return (
                  <div 
                    key={idx} 
                    className={`relative aspect-square rounded-[35px] border-4 transition-all duration-500 flex items-center justify-center bg-white dark:bg-slate-800 ${
                      isMatched 
                        ? 'border-green-400 scale-105 shadow-xl bg-green-50 dark:bg-green-900/20' 
                        : 'border-purple-200 dark:border-purple-800 shadow-lg'
                    }`}
                  >
                    <img 
                      src={`${ASSETS_PATH}${item.name}.${item.ext}`} 
                      alt={item.name}
                      className={`w-4/5 h-4/5 object-contain transition-opacity duration-300 ${isMatched ? 'opacity-100' : 'opacity-100'}`}
                      onError={(e) => {
                        console.error(`Failed to load: ${e.target.src}`);
                        // Fallback emoji if image fails
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<span class="text-4xl">🖼️</span>';
                      }}
                    />
                    {isMatched && (
                      <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl shadow-xl animate-bounce border-4 border-white z-20">
                        ✓
                      </div>
                    )}
                    <div className="absolute -bottom-3 -left-3 bg-purple-600 text-white rounded-2xl px-4 py-1 text-xl font-black shadow-lg border-2 border-white z-20">
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback Message Area (Accessible) */}
            <div className="h-28 flex items-center justify-center mb-10">
              {feedback === 'wrong' && (
                <div className="bg-red-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl animate-shake shadow-2xl border-b-8 border-red-700">
                  You can do it, Try Again! 💪
                </div>
              )}
              {feedback === 'correct' && (
                <div className="bg-green-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl animate-pulse shadow-2xl border-b-8 border-green-700">
                  Great! ✨
                </div>
              )}
              {!feedback && (
                <div className="text-purple-400 dark:text-purple-500 font-black text-2xl tracking-widest uppercase opacity-70 bg-purple-50 dark:bg-purple-900/20 px-8 py-2 rounded-full border border-purple-100 dark:border-purple-800">
                  {selections.length === 0 ? "Start with #1" : `Now find #${selections.length + 1}`}
                </div>
              )}
            </div>

            {/* Word Buttons (Jumbled) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {jumbledWords.map((word, idx) => {
                const isSelected = selections.includes(idx);
                const isCurrentWrong = feedback === 'wrong' && lastClickedIndex === idx;

                // Color palette for the buttons to make it more attractive
                const colors = [
                  'bg-orange-500 border-orange-700 hover:bg-orange-600 dark:border-orange-800',
                  'bg-blue-500 border-blue-700 hover:bg-blue-600 dark:border-blue-800',
                  'bg-pink-500 border-pink-700 hover:bg-pink-600 dark:border-pink-800',
                  'bg-green-500 border-green-700 hover:bg-green-600 dark:border-green-800'
                ];
                const buttonColor = colors[idx % colors.length];

                return (
                  <Button
                    key={idx}
                    disabled={isSelected || feedback === 'wrong'}
                    onClick={() => handleWordClick(word, idx)}
                    className={`
                      h-28 text-4xl font-black rounded-[35px] transition-all shadow-xl transform tracking-widest uppercase border-b-8 text-white
                      ${isSelected 
                        ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 border-gray-300 dark:border-slate-700 scale-95 shadow-none translate-y-1 opacity-50' 
                        : isCurrentWrong
                          ? 'bg-red-600 text-white animate-shake border-red-800 shadow-red-200 translate-y-1'
                          : `${buttonColor} active:translate-y-1 active:shadow-none`
                      }
                    `}
                  >
                    {word}
                  </Button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Decorative Visual-First Footer */}
      <div className="mt-12 flex gap-10 opacity-80 z-0">
        <span className="text-6xl animate-pulse">🧸</span>
        <span className="text-6xl">🍭</span>
        <span className="text-6xl animate-bounce" style={{ animationDelay: '0.3s' }}>🌈</span>
        <span className="text-6xl">🦄</span>
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

export default PicoWord;
