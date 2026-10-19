import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal } from '@/components/ui';
import speechService from '@/utils/speech';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const MISSIONS = {
  1: [
    { id: '1-1', text: "Find the golden key", target: 'key', color: 'golden', choices: ['key', 'rocket', 'crystal'] },
    { id: '1-2', text: "Find the red apple", target: 'apple', color: 'red', choices: ['apple', 'leaf', 'blue-star'] },
    { id: '1-3', text: "Find the blue star", target: 'blue-star', color: 'blue', choices: ['blue-star', 'moon', 'key'] },
    { id: '1-4', text: "Find the green leaf", target: 'leaf', color: 'green', choices: ['leaf', 'apple', 'crystal'] },
    { id: '1-5', text: "Find the yellow moon", target: 'moon', color: 'yellow', choices: ['moon', 'blue-star', 'rocket'] },
  ],
  2: [
    { id: '2-1', text: "Find the blue crystal", target: 'crystal', color: 'blue', choices: ['crystal', 'key', 'rocket', 'alien'] },
    { id: '2-2', text: "Find the red rocket", target: 'rocket', color: 'red', choices: ['rocket', 'blue-star', 'purple-planet', 'key'] },
    { id: '2-3', text: "Find the white spaceship", target: 'white-spaceship', color: 'white', choices: ['white-spaceship', 'crystal', 'alien', 'moon'] },
    { id: '2-4', text: "Find the green alien", target: 'alien', color: 'green', choices: ['alien', 'purple-planet', 'rocket', 'blue-star'] },
    { id: '2-5', text: "Find the purple planet", target: 'purple-planet', color: 'purple', choices: ['purple-planet', 'moon', 'crystal', 'white-spaceship'] },
  ],
  3: [
    { 
      id: '3-1', 
      text: "Find the blue crystal and take it to the spaceship", 
      target: 'crystal', 
      color: 'blue', 
      destination: 'white-spaceship',
      choices: ['crystal', 'key', 'rocket'],
      destinations: ['white-spaceship', 'station', 'moon']
    },
    { 
      id: '3-2', 
      text: "Find the red star and place it beside the moon", 
      target: 'red-star', 
      color: 'red', 
      destination: 'moon',
      choices: ['red-star', 'apple', 'leaf'],
      destinations: ['moon', 'white-spaceship', 'purple-planet']
    },
    { 
      id: '3-3', 
      text: "Find the golden key and move it to the space station", 
      target: 'key', 
      color: 'golden', 
      destination: 'station',
      choices: ['key', 'crystal', 'rocket'],
      destinations: ['station', 'moon', 'white-spaceship']
    },
  ]
};

const ASSET_IMAGES = {
  key: '/assets/games/galaxy-rescue/images/golden-key.png',
  rocket: '/assets/games/galaxy-rescue/images/red-rocket.png',
  crystal: '/assets/games/galaxy-rescue/images/blue-crystal.png',
  apple: '/assets/games/galaxy-rescue/images/red-apple.png',
  leaf: '/assets/games/galaxy-rescue/images/green-leaf.png',
  'blue-star': '/assets/games/galaxy-rescue/images/blue-star.png',
  'red-star': '/assets/games/galaxy-rescue/images/red-star.png',
  moon: '/assets/games/galaxy-rescue/images/yellow-moon.png',
  alien: '/assets/games/galaxy-rescue/images/green-alien.png',
  planet: '/assets/games/galaxy-rescue/images/rainbow-planet.png',
  spaceship: '/assets/games/galaxy-rescue/images/spaceship.png',
  station: '/assets/games/galaxy-rescue/images/galaxy-station.png',
  asteroid: '/assets/games/galaxy-rescue/images/asteroid.png',
  comet: '/assets/games/galaxy-rescue/images/comet.png',
  satellite: '/assets/games/galaxy-rescue/images/satellite.png',
  ufo: '/assets/games/galaxy-rescue/images/ufo.png',
  'purple-planet': '/assets/games/galaxy-rescue/images/purple-planet.png',
  'white-spaceship': '/assets/games/galaxy-rescue/images/white-spaceship.png'
};

const DECORATIVE_ASSETS = ['asteroid', 'comet', 'satellite', 'ufo', 'blue-star', 'red-star', 'moon'];

const MASCOT_IMAGE = '/assets/games/galaxy-rescue/images/mascot.png';
const SPACE_BG = '/assets/games/galaxy-rescue/images/space-bg.png';

const PLANETS = {
  1: { name: 'Rainbow Planet', image: '/assets/games/galaxy-rescue/images/rainbow-planet.png', color: 'from-pink-500/20 to-purple-500/20' },
  2: { name: 'Crystal Planet', image: '/assets/games/galaxy-rescue/images/crystal-planet.png', color: 'from-blue-500/20 to-cyan-500/20' },
  3: { name: 'Galaxy Station', image: '/assets/games/galaxy-rescue/images/galaxy-station.png', color: 'from-indigo-500/20 to-purple-800/20' }
};

const MIKA_INTRO = "I am Mika the alien. My friend Sara is lost she is on another planet. Can you help me get to her by following the clues and finding objects?";

const STORAGE_KEYS = {
  LEVEL: 'galaxy_rescue_level',
  MISSION: 'galaxy_rescue_mission',
  STARS: 'galaxy_rescue_stars',
  STATS: 'galaxy_rescue_stats',
  GAME_STATE: 'galaxy_rescue_state',
  MAX_UNLOCKED: 'galaxy_rescue_max_unlocked',
  SPEECH_RATE: 'galaxy_rescue_speech_rate',
  SPEECH_VOICE: 'galaxy_rescue_speech_voice'
};

const TransparentImage = ({ src, alt, className, style, ...props }) => {
  const canvasRef = React.useRef(null);
  const [processedSrc, setProcessedSrc] = React.useState(src);

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove black background (or very dark pixels)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Use a threshold to remove dark backgrounds (Gemini black might not be pure #000)
        // Adjusting threshold to be more aggressive
        if (r < 40 && g < 40 && b < 40) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSrc(canvas.toDataURL());
    };
  }, [src]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img src={processedSrc} alt={alt} className={className} style={style} {...props} />
    </>
  );
};

const GalaxyRescue = () => {
  const navigate = useNavigate();
  
  // Persisted state
  const [gameState, setGameState] = useLocalStorage(STORAGE_KEYS.GAME_STATE, 'intro');
  const [level, setLevel] = useLocalStorage(STORAGE_KEYS.LEVEL, 1);
  const [missionIndex, setMissionIndex] = useLocalStorage(STORAGE_KEYS.MISSION, 0);
  const [stars, setStars] = useLocalStorage(STORAGE_KEYS.STARS, 0);
  const [stats, setStats] = useLocalStorage(STORAGE_KEYS.STATS, {
    totalMissions: 0,
    firstAttemptSuccess: 0,
    totalAttempts: 0
  });
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useLocalStorage(STORAGE_KEYS.MAX_UNLOCKED, 1);
  const [speechRate, setSpeechRate] = useLocalStorage(STORAGE_KEYS.SPEECH_RATE, 0.85);
  const [speechVoice, setSpeechVoice] = useLocalStorage(STORAGE_KEYS.SPEECH_VOICE, null);

  // Update max unlocked level
  useEffect(() => {
    if (level > maxUnlockedLevel) {
      setMaxUnlockedLevel(level);
    }
  }, [level, maxUnlockedLevel, setMaxUnlockedLevel]);

  // Session state
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

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
  
  // Immersive floating positions
  const [objectPositions, setObjectPositions] = useState([]);
  const [destinationPositions, setDestinationPositions] = useState([]);
  const [decorativeObjects, setDecorativeObjects] = useState([]);

  // Drag and Drop state for Level 3
  const [draggedItem, setDraggedItem] = useState(null);

  const currentMission = useMemo(() => MISSIONS[level][missionIndex], [level, missionIndex]);

// Generate random positions for objects that avoid the center and each other
  const generatePositions = useCallback(() => {
    if (!currentMission) return;
    
    // Use an even larger grid for more distribution options (9x9 = 81 cells)
    const gridSize = 9;
    const totalCells = gridSize * gridSize;
    
    // Avoid center 3x3 area for mascot (Rows 3-5, Cols 3-5)
    const forbiddenCells = [
      30, 31, 32,
      39, 40, 41,
      48, 49, 50
    ];
    
    const availableCells = Array.from({length: totalCells}, (_, i) => i).filter(i => !forbiddenCells.includes(i));
    
    // For Level 3, we split the screen into left and right areas
    const leftCells = availableCells.filter(i => (i % gridSize) < 4);
    const rightCells = availableCells.filter(i => (i % gridSize) > 4);
    
    const shuffledCells = [...availableCells].sort(() => Math.random() - 0.5);
    const shuffledLeftCells = [...leftCells].sort(() => Math.random() - 0.5);
    const shuffledRightCells = [...rightCells].sort(() => Math.random() - 0.5);
    
    let usedCount = 0;
    let usedLeftCount = 0;
    let usedRightCount = 0;
    const cellSize = 100 / gridSize;
    const offset = cellSize / 2;

    // 1. Mission Objects (Targets + Choices)
    const positions = currentMission.choices.map((_, i) => {
      let row, col;
      
      if (level === 3) {
        // Match user sketch: Choices on the far left in a vertical line
        const rows = [1, 4, 7];
        row = rows[i % rows.length];
        col = 1; 
      } else {
        const cellIndex = shuffledCells[usedCount++];
        row = Math.floor(cellIndex / gridSize);
        col = cellIndex % gridSize;
      }
      
      const cellSize = 100 / gridSize;
      const offset = cellSize / 2;
      
      // Add a tiny bit of random jitter within the cell
      const jitterT = (Math.random() - 0.5) * 4;
      const jitterL = (Math.random() - 0.5) * 4;

      return {
        top: `${row * cellSize + offset + jitterT}%`,
        left: `${col * cellSize + offset + jitterL}%`,
        // Make Level 3 choices significantly bigger as requested
        scale: level === 3 ? 1.5 : 0.8 + Math.random() * 0.3, 
        delay: `${Math.random() * 5}s`,
        duration: `${8 + Math.random() * 6}s`
      };
    });
    setObjectPositions(positions);

    // 2. Destinations (Level 3)
    if (level === 3) {
      const destPositions = currentMission.destinations.map((_, i) => {
        // Match user sketch: Staggered "triangle" layout on the right
        // Top and Bottom are slightly inward, Middle is further out to the right
        const rows = [1, 4, 7];
        const cols = [6, 8, 6]; 
        const row = rows[i % rows.length];
        const col = cols[i % cols.length];
        
        return {
          top: `${row * cellSize + offset}%`,
          left: `${col * cellSize + offset}%`,
          delay: `${Math.random() * 5}s`
        };
      });
      setDestinationPositions(destPositions);
    }

    // 3. Decorative Objects (Clickable as "wrong")
    const availableDecor = DECORATIVE_ASSETS.filter(asset => !currentMission.choices.includes(asset));
    const shuffledDecor = [...availableDecor].sort(() => Math.random() - 0.5);
    
    const decorativeCount = Math.min(shuffledDecor.length, 6); // Up to 6 unique decor items
    const decor = [];
    for (let i = 0; i < decorativeCount; i++) {
      let row, col;
      
      if (level === 3) {
        // For level 3, put decorative objects in Cols 0 and 3 (flanking the choices)
        const cols = [0, 3];
        const rows = [0, 2, 5, 8];
        col = cols[i % cols.length];
        row = rows[Math.floor(i / cols.length) % rows.length];
      } else {
        if (usedCount >= shuffledCells.length) break;
        const cellIndex = shuffledCells[usedCount++];
        row = Math.floor(cellIndex / gridSize);
        col = cellIndex % gridSize;
      }
      
      const type = shuffledDecor[i];
      decor.push({
        type,
        top: `${row * cellSize + offset}%`,
        left: `${col * cellSize + offset}%`,
        scale: 0.6 + Math.random() * 0.3,
        opacity: 0.9,
        duration: `${10 + Math.random() * 10}s`,
        delay: `${Math.random() * 5}s`
      });
    }
    setDecorativeObjects(decor);

  }, [currentMission, level]);

  useEffect(() => {
    generatePositions();
  }, [generatePositions, missionIndex, level]);

  const playInstruction = useCallback(() => {
    if (!currentMission) return;
    setIsSpeaking(true);
    speechService.speak(currentMission.text, {
      rate: speechRate,
      voice: speechVoice,
      onEnd: () => setIsSpeaking(false)
    });
  }, [currentMission, speechRate, speechVoice]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setTimeout(() => {
        playInstruction();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, level, missionIndex, playInstruction]);

  // Intro speech
  useEffect(() => {
    if (gameState === 'intro') {
      const timer = setTimeout(() => {
        setIsSpeaking(true);
        speechService.speak(MIKA_INTRO, {
          rate: speechRate,
          voice: speechVoice,
          onEnd: () => setIsSpeaking(false)
        });
      }, 1000);
      return () => {
        clearTimeout(timer);
        speechService.stop();
      };
    }
  }, [gameState, speechRate, speechVoice]);

  const handleChoiceClick = (choice) => {
    if (gameState !== 'playing' || isSpeaking) return;

    // For level 3, clicking an item selects it for the next destination click
    if (level === 3) {
      setDraggedItem(prev => prev === choice ? null : choice);
      return;
    }

    const isCorrect = choice === currentMission.target;
    processChoice(isCorrect);
  };

  const processChoice = (isCorrect) => {
    setStats(prev => ({ ...prev, totalAttempts: prev.totalAttempts + 1 }));
    
    if (isCorrect) {
      const isFirstAttempt = attempts === 0;
      setFeedback('correct');
      setGameState('feedback');
      setStars(prev => prev + 5);
      
      if (isFirstAttempt) {
        setStats(prev => ({ ...prev, firstAttemptSuccess: prev.firstAttemptSuccess + 1 }));
      }
      
      // Celebrate
      speechService.speak("Good job! You found it!", { rate: speechRate, voice: speechVoice });
    } else {
      setFeedback('wrong');
      setAttempts(prev => prev + 1);
      // Explicitly tell "TRY AGAIN"
      speechService.speak("TRY AGAIN", { rate: speechRate, voice: speechVoice });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleNextMission = () => {
    setFeedback(null);
    setAttempts(0);
    setStats(prev => ({ ...prev, totalMissions: prev.totalMissions + 1 }));

    if (missionIndex < MISSIONS[level].length - 1) {
      setMissionIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      // Level complete
      if (level < 3) {
        setGameState('planet-unlock');
      } else {
        setGameState('summary');
      }
    }
  };

  const unlockNextPlanet = () => {
    setLevel(prev => prev + 1);
    setMissionIndex(0);
    setGameState('playing');
  };

  const resetGame = () => {
    setLevel(1);
    setMaxUnlockedLevel(1);
    setMissionIndex(0);
    setStars(0);
    setStats({
      totalMissions: 0,
      firstAttemptSuccess: 0,
      totalAttempts: 0
    });
    setGameState('intro');
    setFeedback(null);
    setAttempts(0);
  };

  // Level 3 Drag and Drop handlers
  const onDragStart = (e, choice) => {
    if (level !== 3 || gameState !== 'playing') return;
    setDraggedItem(choice);
  };

  const onDrop = (e, dest) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (level !== 3 || !draggedItem) return;
    
    const isCorrect = draggedItem === currentMission.target && dest === currentMission.destination;
    processChoice(isCorrect);
    setDraggedItem(null);
  };

  const renderChoices = () => {
    const choices = currentMission.choices;
    // Ensure we have positions for all choices to avoid undefined errors during transitions
    if (objectPositions.length < choices.length) return null;

    return (
      <>
        {choices.map((choice, idx) => {
          const pos = objectPositions[idx];
          return (
            <div
              key={`${currentMission.id}-${idx}`}
              draggable={level === 3}
              onDragStart={(e) => onDragStart(e, choice)}
              onClick={() => handleChoiceClick(choice)}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
                animation: `float ${pos.duration} ease-in-out infinite alternate`,
                animationDelay: pos.delay
              }}
              className={`
                w-28 h-28 md:w-40 md:h-40 flex items-center justify-center p-2
                cursor-pointer transition-all hover:scale-110 active:scale-95
                drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]
                ${feedback === 'correct' && choice === currentMission.target ? 'drop-shadow-[0_0_40px_rgba(34,197,94,0.8)] scale-125' : ''}
                ${draggedItem === choice ? 'drop-shadow-[0_0_40px_rgba(79,70,229,0.8)] scale-110 brightness-125' : ''}
                z-30
              `}
            >
              <TransparentImage 
                src={ASSET_IMAGES[choice]} 
                alt={choice} 
                className="w-full h-full object-contain brightness-110 contrast-105 pointer-events-none"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<span class="text-4xl">📦</span>';
                }}
              />
            </div>
          );
        })}
      </>
    );
  };

  const renderDestinations = () => {
    // Ensure we have positions for all destinations to avoid undefined errors
    if (level !== 3 || destinationPositions.length < (currentMission.destinations?.length || 0)) return null;
    return (
      <>
        {currentMission.destinations.map((dest, idx) => {
          const pos = destinationPositions[idx];
          return (
            <div
              key={`dest-${idx}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, dest)}
              onClick={() => draggedItem && onDrop(null, dest)}
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)',
                animation: level === 3 ? 'none' : `float 8s ease-in-out infinite alternate`,
                animationDelay: pos.delay
              }}
              className={`
                w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6
                transition-all backdrop-blur-sm
                ${draggedItem ? 'border-indigo-400 bg-indigo-50/20 animate-pulse z-40' : 'border-white/20 bg-white/5 z-35'}
              `}
            >
              <TransparentImage 
                src={ASSET_IMAGES[dest]} 
                alt={dest} 
                className="w-full h-full object-contain opacity-80 brightness-110 contrast-105 pointer-events-none"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<span class="text-4xl">📍</span>';
                }}
              />
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50 pointer-events-none">
                {dest === 'station' ? 'Space Station' : dest === 'purple-planet' ? 'Purple Planet' : dest === 'white-spaceship' ? 'Spaceship' : dest}
              </span>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center font-sans text-white overflow-hidden relative`}
    >
      {/* Moving Space Background */}
      <div 
        className="absolute inset-0 bg-fixed bg-center bg-cover scale-110 animate-space-bg"
        style={{ backgroundImage: `url(${SPACE_BG})` }}
      />

      {/* Overlay to ensure colors blend well and background is dark */}
      <div className={`absolute inset-0 bg-black/60 backdrop-brightness-50 pointer-events-none z-0`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${PLANETS[level].color} mix-blend-overlay pointer-events-none z-0`} />
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 bg-black/40 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 relative z-50 mt-4 mx-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl text-3xl">🚀</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">GALAXY RESCUE</h1>
            <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{PLANETS[level].name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-black text-xl shadow-lg flex items-center gap-2">
            ⭐ {stars}
          </div>
          {gameState !== 'intro' && (
            <Button 
              onClick={() => setGameState('intro')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl"
            >
              CHANGE PLANET
            </Button>
          )}
          <Button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl"
          >
            ⚙️
          </Button>
          <Button 
            onClick={() => navigate('/games')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl"
          >
            EXIT
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 p-4 md:p-8">
        
        {gameState === 'intro' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-xl animate-in zoom-in duration-500 z-50 border border-white/10">
            <div className="w-64 h-64 md:w-80 md:h-80 -mb-8 animate-alien-float">
              <TransparentImage src={MASCOT_IMAGE} alt="Mascot" className="w-full h-full object-contain brightness-125" />
            </div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Hi, I'm Mika!</h2>
            <p className="text-xl text-white/80 mb-8 font-medium italic leading-relaxed">
              "{MIKA_INTRO}"
            </p>
            <div className="flex flex-col gap-4 w-full">
              <Button 
                onClick={() => setGameState('playing')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-10 px-20 rounded-[40px] shadow-2xl transform transition-all active:scale-95"
              >
                {level > 1 || missionIndex > 0 ? 'RESUME MISSION 🚀' : 'START MISSION 🚀'}
              </Button>
              
              {maxUnlockedLevel > 1 && (
                <div className="bg-white/5 p-6 rounded-[30px] border border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-4">Jump to Unlocked Planet</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((l) => (
                      <button
                        key={l}
                        disabled={l > maxUnlockedLevel}
                        onClick={() => {
                          setLevel(l);
                          setMissionIndex(0);
                          setGameState('playing');
                        }}
                        className={`
                          flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all
                          ${level === l ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}
                          ${l > maxUnlockedLevel ? 'opacity-20 grayscale cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <img src={PLANETS[l].image} alt="" className="w-10 h-10 object-contain" />
                        <span className="text-[8px] font-black uppercase tracking-tighter">{PLANETS[l].name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(level > 1 || missionIndex > 0 || stars > 0) && (
                <Button 
                  onClick={resetGame}
                  className="bg-white/10 hover:bg-white/20 text-white text-xl font-bold py-6 px-12 rounded-[30px] border border-white/20 transform transition-all active:scale-95"
                >
                  RESTART FROM BEGINNING 🔄
                </Button>
              )}
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1 w-full relative">
            {/* Decorative Background Objects (Now Clickable) */}
            {decorativeObjects.map((obj, i) => (
              <div
                key={`decor-${i}`}
                draggable={level === 3}
                onDragStart={(e) => onDragStart(e, obj.type)}
                onClick={() => level === 3 ? setDraggedItem(prev => prev === obj.type ? null : obj.type) : processChoice(false)}
                style={{
                  position: 'absolute',
                  top: obj.top,
                  left: obj.left,
                  transform: `translate(-50%, -50%) scale(${obj.scale})`,
                  opacity: obj.opacity,
                  cursor: 'pointer',
                  zIndex: 25
                }}
                className={`
                  w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
                  ${draggedItem === obj.type ? 'drop-shadow-[0_0_40px_rgba(79,70,229,0.8)] scale-110 brightness-125' : ''}
                `}
              >
                <TransparentImage 
                  src={ASSET_IMAGES[obj.type]} 
                  alt="" 
                  className="w-full h-full object-contain animate-float pointer-events-none"
                />
              </div>
            ))}

            {/* Alien Mascot (Center) */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[450px] md:h-[450px] transition-all duration-500 ${isSpeaking ? 'scale-110' : 'scale-100'} z-20`}>
              <TransparentImage 
                src={MASCOT_IMAGE} 
                alt="Mascot" 
                className={`w-full h-full object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] brightness-110 contrast-105 ${isSpeaking ? 'animate-pulse' : 'animate-alien-float'}`} 
              />
            </div>

            {/* Replay Button (Fixed relative to mascot) */}
            <button 
              onClick={playInstruction}
              disabled={isSpeaking}
              className={`
                absolute top-[75%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-2xl flex items-center justify-center text-3xl
                transition-all hover:scale-110 active:scale-95 disabled:opacity-50 z-30
              `}
            >
              🔊
            </button>

            {renderChoices()}
            {renderDestinations()}

            {feedback === 'wrong' && (
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl shadow-2xl animate-bounce z-50">
                Try again, space hero! 💪
              </div>
            )}
          </div>
        )}

        {gameState === 'feedback' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300 z-50">
             <div className="text-9xl mb-8 animate-bounce">✨</div>
             <h2 className="text-6xl font-black text-white mb-8 text-center drop-shadow-lg">AMAZING!</h2>
             <div className="bg-yellow-400 text-yellow-900 px-10 py-4 rounded-[30px] font-black text-4xl shadow-xl mb-12">
               +5 STARS ⭐
             </div>
             <Button 
              onClick={handleNextMission}
              className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl transition-all active:scale-95"
             >
               CONTINUE ➡️
             </Button>
          </div>
        )}

        {gameState === 'planet-unlock' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-xl animate-in fade-in duration-700 z-50 border border-white/10">
            <div className="text-9xl mb-8">🔓</div>
            <h2 className="text-4xl font-black mb-4">PLANET UNLOCKED!</h2>
            <p className="text-xl text-white/80 mb-8">
              Great job! You've earned enough stars to explore the next planet!
            </p>
            <div className="w-48 h-48 mb-10">
              <img src={PLANETS[level + 1].image} alt="Planet" className="w-full h-full object-contain mix-blend-screen brightness-125" />
            </div>
            <Button 
              onClick={unlockNextPlanet}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl"
            >
              GO TO {PLANETS[level + 1].name.toUpperCase()} 🚀
            </Button>
          </div>
        )}

        {gameState === 'summary' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-10 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-2xl animate-in zoom-in duration-500 z-50 border border-white/10">
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Mission Accomplished!</h2>
            <p className="text-white/50 font-bold mb-8 uppercase tracking-widest">Final Report</p>
            
            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10">
                <p className="text-xs font-black text-indigo-300 uppercase mb-1">Total Stars</p>
                <p className="text-4xl font-black text-white">{stars}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10">
                <p className="text-xs font-black text-green-300 uppercase mb-1">Accuracy</p>
                <p className="text-4xl font-black text-white">
                  {Math.round((stats.firstAttemptSuccess / stats.totalMissions) * 100) || 0}%
                </p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10">
                <p className="text-xs font-black text-yellow-400 uppercase mb-1">Missions</p>
                <p className="text-4xl font-black text-white">{stats.totalMissions}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10">
                <p className="text-xs font-black text-purple-300 uppercase mb-1">Success Rate</p>
                <p className="text-4xl font-black text-white">{stats.firstAttemptSuccess}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Button 
                onClick={() => navigate('/games')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl w-full"
              >
                FINISH 🚀
              </Button>
              <Button 
                onClick={resetGame}
                className="bg-white/10 hover:bg-white/20 text-white text-xl font-bold py-6 px-12 rounded-[30px] border border-white/20"
              >
                PLAY AGAIN 🔄
              </Button>
            </div>
          </div>
        )}

      </main>

      {/* Progress Footer */}
      {gameState === 'playing' && (
        <footer className="w-full max-w-4xl mt-8 relative z-50 p-4 md:p-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-70">Mission {missionIndex + 1} of {MISSIONS[level].length}</span>
            <span className="text-xs font-black uppercase tracking-widest opacity-70">{Math.round(((missionIndex) / MISSIONS[level].length) * 100)}% Complete</span>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden border border-white/10">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${(missionIndex / MISSIONS[level].length) * 100}%` }}
            />
          </div>
        </footer>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="GAME SETTINGS"
      >
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Audio Speed</label>
              <span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-black text-white">{speechRate.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="1.5" 
              step="0.05" 
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
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
              className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl p-4 text-gray-900 dark:text-white font-bold outline-none focus:border-indigo-500 appearance-none"
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
            onClick={() => {
              speechService.speak("Testing audio speed and voice", { rate: speechRate, voice: speechVoice });
            }}
            className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-indigo-600 dark:text-white border border-gray-200 dark:border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            🔊 TEST AUDIO
          </Button>

          <Button 
            onClick={() => setIsSettingsOpen(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl"
          >
            SAVE & CLOSE
          </Button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 10px rgba(168,85,247,0.4)); }
          50% { transform: scale(1.05); opacity: 0.8; filter: drop-shadow(0 0 20px rgba(168,85,247,0.8)); }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(10px) rotate(-5deg); }
        }
        @keyframes alien-float {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(10px, -15px) rotate(2deg); }
          66% { transform: translate(-10px, 10px) rotate(-2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes space-bg {
          0% { transform: scale(1.1) translate(0, 0); }
          50% { transform: scale(1.15) translate(-1%, -1%); }
          100% { transform: scale(1.1) translate(0, 0); }
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite alternate;
        }
        .animate-alien-float {
          animation: alien-float 8s ease-in-out infinite;
        }
        .animate-space-bg {
          animation: space-bg 30s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default GalaxyRescue;
