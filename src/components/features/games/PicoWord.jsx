import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal } from '@/components/ui';
import { speechService } from '@/utils/speech';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ASSETS_PATH = '/assets/games/game-01/';

const LEVELS = [
  {
    id: 1,
    name: 'Happy Beginnings',
    difficulty: 'Easy',
    picsCount: 4,
    wordChoicesCount: 4,
    items: ['apple', 'car', 'dog', 'flower'],
    distractors: []
  },
  {
    id: 2,
    name: 'Curious Garden',
    difficulty: 'Beginner',
    picsCount: 4,
    wordChoicesCount: 6,
    items: ['apple', 'tomato', 'cat', 'dog', 'banana'],
    distractors: ['orange', 'bird']
  },
  {
    id: 3,
    name: 'Clever Explorer',
    difficulty: 'Intermediate',
    picsCount: 5,
    wordChoicesCount: 8,
    items: ['lemon', 'banana', 'butterfly', 'cup', 'spoon'],
    distractors: ['fork', 'star', 'moon']
  },
  {
    id: 4,
    name: 'Detail Detective',
    difficulty: 'Advanced',
    picsCount: 6,
    wordChoicesCount: 10,
    items: ['lemon', 'apple', 'butterfly', 'cup', 'spoon', 'fork'],
    distractors: ['banana', 'tomato', 'book', 'pen']
  },
  {
    id: 5,
    name: 'Master Matcher',
    difficulty: 'Expert',
    picsCount: 7,
    wordChoicesCount: 12,
    items: ['apple', 'tomato', 'banana', 'orange', 'rabbit', 'tiger', 'lion'],
    distractors: ['dog', 'cat', 'snake', 'crocodile', 'honey_bee']
  },
  {
    id: 6,
    name: 'Ultimate Word Champion',
    difficulty: 'Very Hard',
    picsCount: 8,
    wordChoicesCount: 14,
    items: ['snake', 'crocodile', 'honey_bee', 'butterfly', 'book', 'pen', 'pencil', 'star'],
    distractors: ['moon', 'lemon', 'apple', 'car', 'dog', 'flower', 'fish', 'elephant']
  },
  {
    id: 7,
    name: 'Nature Scout',
    difficulty: 'Expert+',
    picsCount: 8,
    wordChoicesCount: 14,
    items: ['ladybug', 'leaf', 'flower', 'tree', 'sun', 'moon', 'honey_bee', 'butterfly'],
    distractors: ['star', 'bird', 'rabbit', 'lemon', 'apple', 'orange']
  },
  {
    id: 8,
    name: 'Smart Scholar',
    difficulty: 'Genius',
    picsCount: 9,
    wordChoicesCount: 15,
    items: ['book', 'pen', 'pencil', 'ball', 'eyes', 'nose', 'apple', 'banana', 'orange'],
    distractors: ['lemon', 'tomato', 'star', 'moon', 'sun', 'bird']
  },
  {
    id: 9,
    name: 'Animal Kingdom',
    difficulty: 'Master',
    picsCount: 10,
    wordChoicesCount: 16,
    items: ['tiger', 'lion', 'rabbit', 'dog', 'cat', 'elephant', 'fish', 'snake', 'crocodile', 'bird'],
    distractors: ['ladybug', 'honey_bee', 'butterfly', 'leaf', 'tree', 'sun']
  },
  {
    id: 10,
    name: 'Word Legend',
    difficulty: 'Impossible',
    picsCount: 10,
    wordChoicesCount: 18,
    items: ['apple', 'car', 'dog', 'flower', 'star', 'moon', 'book', 'pen', 'pencil', 'ladybug'],
    distractors: ['leaf', 'tree', 'sun', 'eyes', 'nose', 'ball', 'cup', 'spoon']
  }
];

const GAME_ITEMS_DATA = {
  apple: { name: 'Apple', ext: 'png' },
  car: { name: 'Car', ext: 'png' },
  dog: { name: 'Dog', ext: 'png' },
  flower: { name: 'Flower', ext: 'png' },
  tomato: { name: 'Tomato', ext: 'png' },
  banana: { name: 'Banana', ext: 'png' },
  orange: { name: 'Orange', ext: 'png' },
  lemon: { name: 'Lemon', ext: 'png' },
  butterfly: { name: 'Butterfly', ext: 'png' },
  cup: { name: 'Cup', ext: 'png' },
  spoon: { name: 'Spoon', ext: 'png' },
  fork: { name: 'Fork', ext: 'png' },
  star: { name: 'Star', ext: 'png' },
  moon: { name: 'Moon', ext: 'png' },
  book: { name: 'Book', ext: 'png' },
  pen: { name: 'Pen', ext: 'png' },
  pencil: { name: 'Pencil', ext: 'png' },
  honey_bee: { name: 'Honey Bee', ext: 'png' },
  rabbit: { name: 'Rabbit', ext: 'png' },
  tiger: { name: 'Tiger', ext: 'png' },
  lion: { name: 'Lion', ext: 'png' },
  snake: { name: 'Snake', ext: 'png' },
  crocodile: { name: 'Crocodile', ext: 'png' },
  cat: { name: 'Cat', ext: 'png' },
  bird: { name: 'Bird', ext: 'png' },
  fish: { name: 'Gold Fish', ext: 'png' },
  sun: { name: 'Sun', ext: 'png' },
  nose: { name: 'Nose', ext: 'png' },
  eyes: { name: 'Eyes', ext: 'png' },
  ball: { name: 'Ball', ext: 'png' },
  elephant: { name: 'Elephant', ext: 'png' },
  ladybug: { name: 'Ladybug', ext: 'png' },
  leaf: { name: 'Leaf', ext: 'png' },
  tree: { name: 'Tree', ext: 'png' },
};

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(60)].map((_, i) => {
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2.5;
        const delay = Math.random() * 1.5;
        const colors = ['#FFB7CE', '#B7CEFF', '#CEFFB7', '#FFFFB7', '#FFD700', '#F4C2C2', '#C2F4E5'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isStar = Math.random() > 0.6 || color === '#FFD700';
        
        return (
          <div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: '-10%',
              animation: `fall ${duration}s linear ${delay}s infinite`,
            }}
          >
            {isStar ? (
              <span style={{ color: color, fontSize: `${size}px` }}>★</span>
            ) : (
              <div 
                className="w-full h-full" 
                style={{ 
                  backgroundColor: color, 
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  transform: `rotate(${Math.random() * 360}deg)`
                }} 
              />
            )}
          </div>
        );
      })}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fall {
          0% { top: -10%; transform: translateX(0) rotate(0deg); }
          100% { top: 110%; transform: translateX(${Math.random() * 120 - 60}px) rotate(720deg); }
        }
      `}} />
    </div>
  );
};

const PicoWord = () => {
  const [view, setView] = useState('map'); // 'map', 'game'
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [unlockedLevel, setUnlockedLevel] = useLocalStorage('picoword_unlocked_level', 1);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won'
  const [targetPics, setTargetPics] = useState([]);
  const [wordChoices, setWordChoices] = useState([]);
  const [selections, setSelections] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', null
  const [lastClickedIdx, setLastClickedIdx] = useState(-1);
  const [stars, setStars] = useLocalStorage('picoword_stars', 0);
  const [itemAttempts, setItemAttempts] = useState(0);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [speechRate, setSpeechRate] = useLocalStorage('picoword_speech_rate', 0.85);
  const [speechVoice, setSpeechVoice] = useLocalStorage('picoword_speech_voice', null);
  const [availableVoices, setAvailableVoices] = useState([]);

  const currentLevel = LEVELS[currentLevelIdx];

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

  const startLevel = useCallback((levelIdx) => {
    const level = LEVELS[levelIdx];
    
    const selectedKeys = [...level.items].sort(() => 0.5 - Math.random()).slice(0, level.picsCount);
    const selectedItems = selectedKeys.map(key => ({ key, ...GAME_ITEMS_DATA[key] }));

    let choicesKeys = [...selectedKeys];
    const availableDistractors = level.distractors.length > 0 ? level.distractors : Object.keys(GAME_ITEMS_DATA).filter(k => !selectedKeys.includes(k));
    
    const neededDistractors = level.wordChoicesCount - choicesKeys.length;
    const selectedDistractors = [...availableDistractors].sort(() => 0.5 - Math.random()).slice(0, neededDistractors);
    
    choicesKeys = [...choicesKeys, ...selectedDistractors];
    const jumbledChoices = choicesKeys.sort(() => 0.5 - Math.random()).map(key => ({ key, ...GAME_ITEMS_DATA[key] }));

    setTargetPics(selectedItems);
    setWordChoices(jumbledChoices);
    setSelections([]);
    setFeedback(null);
    setGameState('playing');
    setLastClickedIdx(-1);
    setCurrentLevelIdx(levelIdx);
    setItemAttempts(0);
    setView('game');
  }, []);

  const speak = (text) => {
    speechService.speak(text, {
      rate: speechRate,
      voice: speechVoice
    });
  };

  const playInstruction = () => {
    speak("Tap the words in the same order as the pictures");
  };

  const handleWordClick = (item, index) => {
    if (gameState !== 'playing' || selections.includes(index) || feedback === 'wrong') return;

    const nextCorrectKey = targetPics[selections.length].key;

    if (item.key === nextCorrectKey) {
      const newSelections = [...selections, index];
      setSelections(newSelections);
      setFeedback('correct');
      setLastClickedIdx(index);
      
      const points = itemAttempts === 0 ? 10 : 5;
      setStars(prev => prev + points);
      
      speak("Great");

      setTimeout(() => {
        setFeedback(null);
        setItemAttempts(0);
        if (newSelections.length === targetPics.length) {
          setGameState('won');
          if (currentLevelIdx + 1 < LEVELS.length && unlockedLevel <= currentLevelIdx + 1) {
            setUnlockedLevel(currentLevelIdx + 2);
          }
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setLastClickedIdx(index);
      setItemAttempts(prev => prev + 1);
      speak("try again you can do it");
      
      setTimeout(() => {
        setFeedback(null);
        setLastClickedIdx(-1);
      }, 1500);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx + 1 < LEVELS.length) {
      startLevel(currentLevelIdx + 1);
    } else {
      setView('map');
    }
  };

  const handleReplay = () => {
    startLevel(currentLevelIdx);
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setUnlockedLevel(1);
      setStars(0);
      setView('map');
    }
  };

  const MapView = () => {
    const getLevelPosition = (id) => {
      const positions = {
        1: { x: 50, y: 92 },
        2: { x: 75, y: 82 },
        3: { x: 25, y: 72 },
        4: { x: 50, y: 62 },
        5: { x: 75, y: 52 },
        6: { x: 25, y: 42 },
        7: { x: 50, y: 32 },
        8: { x: 75, y: 22 },
        9: { x: 25, y: 12 },
        10: { x: 50, y: 2 },
      };
      return positions[id] || { x: 50, y: 50 };
    };

    const renderPath = () => {
      const points = LEVELS.map(lvl => getLevelPosition(lvl.id));
      let pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        const prev = points[i-1];
        const curr = points[i];
        pathData += ` Q ${curr.x} ${prev.y} ${curr.x} ${curr.y}`;
      }

      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d={pathData} 
            fill="none" 
            stroke="white" 
            strokeWidth="0.8" 
            strokeDasharray="1, 2" 
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.8))' }}
            className="opacity-60"
          />
        </svg>
      );
    };

    return (
      <div className="relative w-full h-[2200px] bg-cover bg-top" style={{ backgroundImage: `url(${ASSETS_PATH}map-background.png)` }}>
        <div className="fixed top-6 left-6 z-50 flex gap-4">
          <button 
            onClick={() => window.history.back()}
            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-brown-700 shadow-xl border-2 border-[#8D6E63] text-2xl"
          >
            ←
          </button>
          <div className="bg-white/90 backdrop-blur rounded-2xl px-6 py-2 flex items-center gap-3 shadow-lg border-2 border-green-200">
            <span className="text-sm font-black text-green-800 uppercase tracking-widest">{unlockedLevel - 1} of 10 levels completed</span>
          </div>
        </div>

        <div className="fixed top-6 right-6 z-50 flex gap-4">
           <div className="bg-white/90 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-lg border-2 border-yellow-200">
              <span className="text-2xl text-yellow-500">⭐</span>
              <span className="text-xl font-black text-brown-800">{stars}</span>
            </div>
            <button 
              onClick={resetProgress}
              className="bg-red-500/90 text-white px-4 py-2 rounded-2xl font-bold shadow-lg border-2 border-white hover:bg-red-600 transition-colors"
            >
              RESET
            </button>
        </div>

        {renderPath()}

        {LEVELS.map((lvl) => {
          const pos = getLevelPosition(lvl.id);
          const isUnlocked = lvl.id <= unlockedLevel;
          const isCompleted = lvl.id < unlockedLevel;
          const isCurrent = lvl.id === unlockedLevel;

          return (
            <div 
              key={lvl.id}
              className="absolute"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {lvl.id === 1 && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none">
                   <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-[#8D6E63] rounded-t-full border-x-8 border-t-8 border-[#5D4037] flex items-center justify-center pt-2 shadow-2xl">
                        <span className="text-3xl font-black text-white tracking-widest uppercase">START</span>
                      </div>
                   </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (isUnlocked) startLevel(lvl.id - 1);
                  else speak("Complete previous level first");
                }}
                className={`relative group transition-all duration-300 ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
              >
                <div className={`w-36 h-28 rounded-[50%] bg-[#A07855]/40 blur-2xl absolute -bottom-6 left-1/2 -translate-x-1/2 -z-10`} />
                
                <div className={`
                  w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center text-white font-black text-4xl shadow-2xl border-[6px] transition-all relative
                  ${isCurrent 
                    ? 'bg-[#FFD700] border-white ring-[10px] ring-white/20 animate-pulse scale-110' 
                    : isCompleted 
                      ? 'bg-[#4CAF50] border-white' 
                      : isUnlocked 
                        ? 'bg-[#7B61FF] border-white' 
                        : 'bg-gray-400 border-gray-300 grayscale opacity-60'
                  }
                `}>
                  {lvl.id}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-full backdrop-blur-[1px]">
                       <span className="text-3xl">🔒</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="absolute -bottom-2 -right-2 bg-white text-[#4CAF50] w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-[#4CAF50]">
                      ✓
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10 shadow-lg">
                   <span className={`text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                     {lvl.name}
                   </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`min-h-screen font-sans overflow-x-hidden transition-all duration-500 ${view === 'map' ? 'bg-[#C5E1A5]' : 'bg-cover bg-center bg-no-repeat'}`}
      style={view === 'game' ? { backgroundImage: `url(${ASSETS_PATH}background.png)` } : {}}
    >
      {view === 'map' ? (
        <div className="w-full overflow-y-auto h-screen scroll-smooth">
          <MapView />
        </div>
      ) : (
        <div className="p-4 md:p-6 flex flex-col items-center min-h-screen">
          {gameState === 'won' && <Confetti />}
          
          <div className="max-w-7xl w-full flex flex-col gap-4">
            
            {/* Header Bar */}
            <div className="flex justify-between items-center bg-transparent px-2">
              <button 
                onClick={() => setView('map')}
                className="w-12 h-12 bg-[#D2B48C] rounded-full flex items-center justify-center text-[#5D4037] shadow-lg border-2 border-white text-2xl font-bold"
              >
                ←
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-[#A07855] px-8 py-2 rounded-2xl border-4 border-[#8D6E63] shadow-md">
                   <h1 className="text-3xl font-black text-white tracking-widest uppercase">PicoWord</h1>
                </div>
                
                <div className="hidden md:flex bg-white/90 rounded-2xl px-6 py-2 flex-col items-center shadow-sm border-2 border-[#F5F5DC]">
                  <span className="text-sm font-black text-[#5D4037]">Level {currentLevel.id} • {currentLevel.name}</span>
                  <span className="bg-[#4CAF50] text-white text-[10px] px-4 py-0.5 rounded-full font-bold uppercase tracking-wider">{currentLevel.difficulty}</span>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                <button 
                  onClick={() => setView('map')}
                  className="bg-white/90 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm border-2 border-green-200 hover:bg-green-50 transition-colors"
                >
                  <span className="text-lg">🗺️</span>
                  <span className="text-xs font-black text-green-800 uppercase">Map</span>
                </button>

                <div className="bg-white/90 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-sm border-2 border-[#F5F5DC]">
                  <span className="text-2xl text-yellow-500">⭐</span>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-[#5D4037] leading-none">{stars}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Stars</span>
                  </div>
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="ml-2 w-10 h-10 bg-[#4CAF50] rounded-full flex items-center justify-center text-white shadow-md border-2 border-white text-lg hover:scale-110 transition-transform"
                  >
                    ⚙️
                  </button>
                </div>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="bg-white/90 rounded-[30px] py-4 px-8 flex items-center justify-between shadow-md border-4 border-white/50">
              <div className="flex items-center gap-6">
                <button 
                  onClick={playInstruction}
                  className="w-14 h-14 bg-[#7B61FF] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white cursor-pointer hover:scale-105 transition-transform text-2xl"
                >
                  🔊
                </button>
                <span className="text-2xl font-black text-[#5D4037]">Tap the words in the same order as the pictures!</span>
              </div>
              <button 
                onClick={handleReplay}
                className="flex items-center gap-2 bg-[#E1D7FF] text-[#7B61FF] px-6 py-3 rounded-full font-black text-lg border-2 border-[#7B61FF]/20 hover:bg-[#D4C6FF] transition-all shadow-sm"
              >
                🔄 Replay
              </button>
            </div>

            {/* Feedback Area */}
            <div className="h-16 flex items-center justify-center -mt-2">
              {feedback === 'wrong' && (
                <div className="bg-[#EF5350] text-white px-8 py-2 rounded-2xl font-black text-xl shadow-lg border-b-4 border-red-700 animate-shake">
                  try again you can do it 💪
                </div>
              )}
              {feedback === 'correct' && (
                <div className="bg-[#4CAF50] text-white px-8 py-2 rounded-2xl font-black text-xl shadow-lg border-b-4 border-green-700 animate-bounce">
                  Great! ✨ (+{itemAttempts === 0 ? 10 : 5} Stars)
                </div>
              )}
            </div>

            {gameState === 'won' ? (
              <div className="flex flex-col items-center py-16 animate-in fade-in zoom-in duration-500 bg-white/40 rounded-[50px] border-8 border-white/60 mt-2 shadow-2xl backdrop-blur-sm">
                <div className="text-9xl mb-8 drop-shadow-2xl animate-bounce">🎊</div>
                <h2 className="text-7xl font-black text-[#4CAF50] mb-4 text-center tracking-tighter">GOOD JOB!</h2>
                <p className="text-3xl font-bold text-[#5D4037] mb-12 text-center opacity-80">You've completed {currentLevel.name}!</p>
                
                <div className="flex gap-8">
                   <button 
                    className="bg-white border-4 border-[#7B61FF] text-[#7B61FF] font-black py-4 px-12 rounded-[30px] text-2xl shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                    onClick={handleReplay}
                  >
                    REPLAY 🔄
                  </button>
                  <button 
                    className="bg-[#4CAF50] border-4 border-[#388E3C] text-white font-black py-5 px-16 rounded-[30px] text-3xl shadow-xl hover:bg-[#45A049] transition-all active:scale-95 animate-pulse"
                    onClick={handleNextLevel}
                  >
                    {currentLevelIdx === LEVELS.length - 1 ? 'FINISH 🏁' : 'NEXT LEVEL 🚀'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Pictures Container */}
                <div className="flex flex-wrap justify-center gap-6 mt-4">
                  {targetPics.map((item, idx) => {
                    const isMatched = selections.length > idx;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`relative w-[calc(50%-1.5rem)] sm:w-[calc(33.33%-1.5rem)] md:w-[calc(25%-1.5rem)] lg:w-[calc(20%-1.5rem)] aspect-square max-w-[240px] rounded-[50px] border-8 transition-all duration-300 flex items-center justify-center bg-white/95 shadow-xl ${
                          isMatched 
                            ? 'border-[#81C784] scale-105 shadow-2xl' 
                            : 'border-white'
                        }`}
                      >
                        {/* Number Badge - Now neutral (white with gray border) */}
                        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-[18px] flex items-center justify-center text-[#5D4037] font-black text-2xl border-4 border-[#EEEEEE] shadow-md z-10">
                          {idx + 1}
                        </div>

                        <img 
                          src={`${ASSETS_PATH}${item.key}.${item.ext}`} 
                          alt={item.name}
                          className={`w-4/5 h-4/5 object-contain transition-all duration-500 ${isMatched ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}`}
                        />

                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="bg-[#4CAF50] text-white rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-2xl border-4 border-white animate-in zoom-in">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sequence Dots */}
            <div className="flex justify-center gap-4 mt-8">
              {targetPics.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-lg transition-all duration-300 ${
                    selections.length === idx 
                      ? 'bg-[#4CAF50] text-white scale-125 shadow-green-200' 
                      : selections.length > idx 
                        ? 'bg-[#A5D6A7] text-[#2E7D32]' 
                        : 'bg-white/80 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Word Buttons Grid */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 pb-20">
              {wordChoices.map((item, idx) => {
                const isSelected = selections.includes(idx);
                const isCurrentWrong = feedback === 'wrong' && lastClickedIdx === idx;

                const colors = [
                  'bg-[#FF80AB] border-[#F06292]',
                  'bg-[#64B5F6] border-[#42A5F5]',
                  'bg-[#FFD54F] border-[#FFC107]',
                  'bg-[#81C784] border-[#66BB6A]',
                  'bg-[#FFB74D] border-[#FFA726]',
                  'bg-[#BA68C8] border-[#AB47BC]'
                ];
                const btnColor = colors[idx % colors.length];

                return (
                  <button
                    key={idx}
                    disabled={isSelected || feedback === 'wrong'}
                    onClick={() => handleWordClick(item, idx)}
                    className={`
                      relative group h-24 px-12 rounded-[35px] border-b-[10px] transition-all flex items-center justify-center text-white shadow-lg
                      ${isSelected 
                        ? 'bg-[#E0E0E0] border-[#BDBDBD] opacity-40 scale-95 cursor-default' 
                        : isCurrentWrong
                          ? 'bg-[#EF5350] border-[#D32F2F] animate-shake shadow-inner'
                          : `${btnColor} hover:-translate-y-2 hover:shadow-2xl active:translate-y-1 active:border-b-0`
                      }
                    `}
                  >
                    <span className="text-4xl font-black tracking-wider uppercase drop-shadow-md">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
          <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="GAME SETTINGS">
            <div className="p-6 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Audio Speed</label>
                  <span className="bg-[#7B61FF] px-4 py-1 rounded-full text-sm font-black text-white">{speechRate.toFixed(2)}x</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.05" 
                  value={speechRate} 
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))} 
                  className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7B61FF]" 
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
                  className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl p-4 text-gray-900 dark:text-white font-bold outline-none focus:border-[#7B61FF] appearance-none"
                >
                  <option value="" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default</option>
                  {availableVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                onClick={() => { speak("Testing audio"); }} 
                className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#7B61FF] dark:text-white border border-gray-200 dark:border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2"
              >
                🔊 TEST AUDIO
              </Button>
              <Button onClick={() => setIsSettingsOpen(false)} className="bg-[#7B61FF] hover:bg-[#6646FF] text-white py-6 rounded-3xl font-black text-xl shadow-xl">
                SAVE & CLOSE
              </Button>
            </div>
          </Modal>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-12px); }
          40% { transform: translateX(12px); }
          60% { transform: translateX(-12px); }
          80% { transform: translateX(12px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}} />
    </div>
  );
};

export default PicoWord;
