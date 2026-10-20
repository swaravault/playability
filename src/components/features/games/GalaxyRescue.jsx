import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Modal } from '@/components/ui';
import speechService from '@/utils/speech';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  1: { 
    name: 'Rainbow Planet', 
    image: '/assets/games/galaxy-rescue/images/rainbow-planet.png', 
    color: 'from-pink-500/20 to-purple-500/20',
    description: "Help Mika recognize basic objects in the colorful rings of Rainbow Planet.",
    objective: "Basic object recognition",
    implemented: true
  },
  2: { 
    name: 'Crystal Planet', 
    image: '/assets/games/galaxy-rescue/images/crystal-planet.png', 
    color: 'from-blue-500/20 to-cyan-500/20',
    description: "Search for glowing crystals and colorful items on this sparkling world.",
    objective: "Color and object identification",
    implemented: true
  },
  3: { 
    name: 'Galaxy Station', 
    image: '/assets/games/galaxy-rescue/images/galaxy-station.png', 
    color: 'from-indigo-500/20 to-purple-800/20',
    description: "Help Mika move equipment around the futuristic Galaxy Station.",
    objective: "Sequential instructions",
    implemented: true
  },
  4: { 
    name: 'Moonlight Planet', 
    image: '/assets/games/galaxy-rescue/images/yellow-moon.png', 
    color: 'from-yellow-500/20 to-orange-500/20',
    description: "A peaceful moon glowing in the night sky. Coming soon!",
    objective: "Advanced Recognition",
    implemented: false
  },
  5: { 
    name: 'Starburst Planet', 
    image: '/assets/games/galaxy-rescue/images/blue-star.png', 
    color: 'from-yellow-400/20 to-red-500/20',
    description: "A planet that shines as bright as a star. Coming soon!",
    objective: "Speed Challenges",
    implemented: false
  },
  6: { 
    name: 'Nebula Planet', 
    image: '/assets/games/galaxy-rescue/images/purple-planet.png', 
    color: 'from-purple-600/20 to-indigo-900/20',
    description: "Hidden within colorful cosmic clouds. Coming soon!",
    objective: "Logic Puzzles",
    implemented: false
  },
  7: { 
    name: 'Comet Planet', 
    image: '/assets/games/galaxy-rescue/images/comet.png', 
    color: 'from-blue-400/20 to-white/10',
    description: "A fast-moving world with a glowing tail. Coming soon!",
    objective: "Memory Match",
    implemented: false
  },
  8: { 
    name: 'Aurora Planet', 
    image: '/assets/games/galaxy-rescue/images/satellite.png', 
    color: 'from-green-400/20 to-blue-500/20',
    description: "Dazzling lights dance across the sky. Coming soon!",
    objective: "Pattern Finding",
    implemented: false
  },
  9: { 
    name: 'Meteor Planet', 
    image: '/assets/games/galaxy-rescue/images/asteroid.png', 
    color: 'from-gray-600/20 to-red-900/20',
    description: "A rocky world filled with ancient meteors. Coming soon!",
    objective: "Audio Sharpness",
    implemented: false
  },
  10: { 
    name: 'Cosmic Rescue Planet', 
    image: '/assets/games/galaxy-rescue/images/spaceship.png', 
    color: 'from-amber-500/20 to-white/20',
    description: "The final destination where Sara is waiting! Coming soon!",
    objective: "Final Challenge",
    implemented: false
  }
};

const MIKA_INTRO = "I am Mika the alien. My friend Sara is lost she is on another planet. Can you help me get to her by following the clues and finding objects?";
const MIKA_SUCCESS = "You did a great job ! Thank you for helping me find my friend Sara !";
const SARA_IMAGE = '/assets/games/galaxy-rescue/images/sara.png';

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

const TransparentImage = ({ src, alt, className, ...props }) => {
  const canvasRef = React.useRef(null);
  const [processedSrc, setProcessedSrc] = React.useState(null);

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Robust background removal (removes very dark OR very light pixels)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Remove black/dark pixels
          if (r < 60 && g < 60 && b < 60) {
            data[i + 3] = 0;
          }
          // Remove white/light pixels (like in the Sara asset)
          else if (r > 210 && g > 210 && b > 210) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setProcessedSrc(canvas.toDataURL());
      } catch (e) {
        console.error("Canvas processing failed", e);
        setProcessedSrc(src);
      }
    };
    img.onerror = () => setProcessedSrc(src);
  }, [src]);

  const displaySrc = processedSrc || src;

  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <img 
        src={displaySrc} 
        alt={alt} 
        className="w-full h-full object-contain" 
        {...props} 
      />
    </div>
  );
};

const ASSET_LABELS = {
  key: 'golden key',
  rocket: 'red rocket',
  crystal: 'blue crystal',
  apple: 'red apple',
  leaf: 'green leaf',
  'blue-star': 'blue star',
  'red-star': 'red star',
  moon: 'yellow moon',
  alien: 'green alien',
  'purple-planet': 'purple planet',
  'white-spaceship': 'white spaceship',
  station: 'space station'
};

const GalaxyRescue = () => {
  const navigate = useNavigate();
  
  // Persisted state
  const [gameState, setGameState] = useLocalStorage(STORAGE_KEYS.GAME_STATE, 'map');
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
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [showPlanetInfo, setShowPlanetInfo] = useState(false);

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
  const [foundTargets, setFoundTargets] = useState([]);
  const [missions, setMissions] = useState([]);

  const generateMissions = useCallback((targetLevel) => {
    const items = ['key', 'rocket', 'crystal', 'apple', 'leaf', 'blue-star', 'red-star', 'moon', 'alien', 'purple-planet', 'white-spaceship'];
    const destinations = ['white-spaceship', 'station', 'moon', 'purple-planet'];
    
    const newMissions = [];
    for (let i = 0; i < 3; i++) {
      const shuffledItems = [...items].sort(() => Math.random() - 0.5);
      const shuffledDests = [...destinations].sort(() => Math.random() - 0.5);
      
      let mission = { id: `${targetLevel}-${i}` };
      
      if (targetLevel === 1) {
        const target = shuffledItems[0];
        mission.target = target;
        mission.text = `Find the ${ASSET_LABELS[target]}`;
        mission.choices = shuffledItems.slice(0, 3);
      } else if (targetLevel === 2) {
        const target1 = shuffledItems[0];
        const target2 = shuffledItems[1];
        mission.targets = [target1, target2];
        mission.text = `Find the ${ASSET_LABELS[target1]} and the ${ASSET_LABELS[target2]}`;
        mission.choices = shuffledItems.slice(0, 4);
      } else if (targetLevel === 3) {
        const target = shuffledItems[0];
        const dest = shuffledDests[0];
        mission.target = target;
        mission.destination = dest;
        mission.text = `Find the ${ASSET_LABELS[target]} and take it to the ${ASSET_LABELS[dest]}`;
        mission.choices = shuffledItems.slice(0, 3);
        mission.destinations = shuffledDests.slice(0, 3);
      }
      
      newMissions.push(mission);
    }
    setMissions(newMissions);
  }, []);

  useEffect(() => {
    generateMissions(level);
  }, [level, generateMissions]);

  const currentMission = useMemo(() => missions[missionIndex] || null, [missions, missionIndex]);

  const generatePositions = useCallback(() => {
    if (!currentMission || !currentMission.choices) return;
    
    const gridSize = 9;
    const totalCells = gridSize * gridSize;
    
    const forbiddenCells = [
      20, 21, 22, 23, 24,
      29, 30, 31, 32, 33,
      38, 39, 40, 41, 42,
      47, 48, 49, 50, 51,
      56, 57, 58, 59, 60
    ];
    
    const availableCells = Array.from({length: totalCells}, (_, i) => i).filter(i => !forbiddenCells.includes(i));
    const shuffledCells = [...availableCells].sort(() => Math.random() - 0.5);
    
    let usedCount = 0;
    const cellSize = 100 / gridSize;
    const offset = cellSize / 2;

    const positions = currentMission.choices.map((_, i) => {
      let row, col;
      if (level === 3) {
        const rows = [1, 4, 7];
        row = rows[i % rows.length];
        col = 1; 
      } else {
        const cellIndex = shuffledCells[usedCount++];
        row = Math.floor(cellIndex / gridSize);
        col = cellIndex % gridSize;
      }
      const jitterT = (Math.random() - 0.5) * 4;
      const jitterL = (Math.random() - 0.5) * 4;
      return {
        top: `${row * cellSize + offset + jitterT}%`,
        left: `${col * cellSize + offset + jitterL}%`,
        scale: level === 3 ? 1.5 : 0.8 + Math.random() * 0.3, 
        delay: `${Math.random() * 5}s`,
        duration: `${8 + Math.random() * 6}s`
      };
    });
    setObjectPositions(positions);

    if (level === 3 && currentMission.destinations) {
      const destPositions = currentMission.destinations.map((_, i) => {
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

    const availableDecor = DECORATIVE_ASSETS.filter(asset => !currentMission.choices.includes(asset));
    const shuffledDecor = [...availableDecor].sort(() => Math.random() - 0.5);
    const decorativeCount = Math.min(shuffledDecor.length, 6);
    const decor = [];
    for (let i = 0; i < decorativeCount; i++) {
      let row, col;
      if (level === 3) {
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
    setFoundTargets([]);
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
      const timer = setTimeout(() => { playInstruction(); }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, level, missionIndex, playInstruction]);

  useEffect(() => {
    if (gameState === 'intro') {
      const timer = setTimeout(() => {
        setIsSpeaking(true);
        speechService.speak(MIKA_INTRO, { rate: speechRate, voice: speechVoice, onEnd: () => setIsSpeaking(false) });
      }, 1000);
      return () => { clearTimeout(timer); speechService.stop(); };
    }
  }, [gameState, speechRate, speechVoice]);

  useEffect(() => {
    if (gameState === 'summary') {
      const timer = setTimeout(() => {
        setIsSpeaking(true);
        speechService.speak(MIKA_SUCCESS, { rate: speechRate, voice: speechVoice, onEnd: () => setIsSpeaking(false) });
      }, 1000);
      return () => { clearTimeout(timer); speechService.stop(); };
    }
  }, [gameState, speechRate, speechVoice]);

  const handleChoiceClick = (choice) => {
    if (gameState !== 'playing' || isSpeaking || !currentMission) return;
    if (level === 3) {
      setDraggedItem(prev => prev === choice ? null : choice);
      return;
    }
    
    if (level === 2) {
      if (foundTargets.includes(choice)) return;
      const nextTarget = currentMission.targets[foundTargets.length];
      if (choice === nextTarget) {
        const nextFound = [...foundTargets, choice];
        setFoundTargets(nextFound);
        if (nextFound.length === currentMission.targets.length) {
          processChoice(true);
        }
      } else {
        processChoice(false);
      }
      return;
    }

    processChoice(choice === currentMission.target);
  };

  const processChoice = (isCorrect) => {
    setStats(prev => ({ ...prev, totalAttempts: prev.totalAttempts + 1 }));
    if (isCorrect) {
      setFeedback('correct');
      setGameState('feedback');
      setStars(prev => prev + 5);
      if (attempts === 0) setStats(prev => ({ ...prev, firstAttemptSuccess: prev.firstAttemptSuccess + 1 }));
      speechService.speak("Good job! You found it!", { rate: speechRate, voice: speechVoice });
    } else {
      setFeedback('wrong');
      setAttempts(prev => prev + 1);
      speechService.speak("TRY AGAIN", { rate: speechRate, voice: speechVoice });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleNextMission = () => {
    setFeedback(null);
    setAttempts(0);
    setStats(prev => ({ ...prev, totalMissions: prev.totalMissions + 1 }));
    if (missionIndex < missions.length - 1) {
      setMissionIndex(prev => prev + 1);
      setGameState('playing');
    } else {
      if (level < 3) setGameState('planet-unlock');
      else setGameState('summary');
    }
  };

  const unlockNextPlanet = () => { setLevel(prev => prev + 1); setMissionIndex(0); setGameState('playing'); };

  const resetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setLevel(1); setMaxUnlockedLevel(1); setMissionIndex(0); setStars(0);
      setStats({ totalMissions: 0, firstAttemptSuccess: 0, totalAttempts: 0 });
      setGameState('map'); setFeedback(null); setAttempts(0); setShowPlanetInfo(false);
    }
  };

  const onDragStart = (e, choice) => { if (level === 3 && gameState === 'playing') setDraggedItem(choice); };
  const onDrop = (e, dest) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (level === 3 && draggedItem) {
      processChoice(draggedItem === currentMission.target && dest === currentMission.destination);
      setDraggedItem(null);
    }
  };

  const renderChoices = () => {
    if (!currentMission || !currentMission.choices) return null;
    return currentMission.choices.map((choice, idx) => {
      const pos = objectPositions[idx];
      if (!pos) return null;
      
      const isCorrectlyFound = (level === 2 && foundTargets.includes(choice)) || 
                              (feedback === 'correct' && choice === currentMission.target);

      return (
        <div key={`${currentMission.id}-${idx}`} draggable={level === 3} onDragStart={(e) => onDragStart(e, choice)} onClick={() => handleChoiceClick(choice)} style={{ position: 'absolute', top: pos.top, left: pos.left, transform: `translate(-50%, -50%) scale(${pos.scale})`, animation: `float ${pos.duration} ease-in-out infinite alternate`, animationDelay: pos.delay }} className={`w-28 h-28 md:w-40 md:h-40 flex items-center justify-center p-2 cursor-pointer transition-all hover:scale-110 active:scale-95 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isCorrectlyFound ? 'drop-shadow-[0_0_40px_rgba(34,197,94,0.8)] scale-125' : ''} ${draggedItem === choice ? 'drop-shadow-[0_0_40px_rgba(79,70,229,0.8)] scale-110 brightness-125' : ''} z-30`}>
          <TransparentImage src={ASSET_IMAGES[choice]} alt={choice} className="w-full h-full" />
        </div>
      );
    });
  };

  const renderGalaxyMap = () => {
    const totalPlanets = Object.keys(PLANETS).length;
    const getPlanetPosition = (id) => {
      const positions = { 1: { x: 85, y: 85 }, 2: { x: 75, y: 65 }, 3: { x: 55, y: 75 }, 4: { x: 40, y: 90 }, 5: { x: 25, y: 75 }, 6: { x: 45, y: 55 }, 7: { x: 70, y: 35 }, 8: { x: 25, y: 25 }, 9: { x: 45, y: 15 }, 10: { x: 65, y: 5 } };
      return positions[id] || { x: 50, y: 50 };
    };

    return (
      <div className="flex-1 w-full relative overflow-y-auto overflow-x-hidden px-4 py-20 scrollbar-hide bg-midnight-blue">
        <div className="relative min-h-[1400px] w-full max-w-5xl mx-auto">
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d={`M 85 85 ${Array.from({length: totalPlanets - 1}, (_, i) => {
              const pos = getPlanetPosition(i + 2);
              const prevPos = getPlanetPosition(i + 1);
              const cpX = (prevPos.x + pos.x) / 2 + (i % 2 === 0 ? 15 : -15);
              const cpY = (prevPos.y + pos.y) / 2;
              return `Q ${cpX} ${cpY} ${pos.x} ${pos.y}`;
            }).join(' ')}`} fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="0.5, 1.5" strokeLinecap="round" className="animate-path-flow" />
          </svg>

          {Object.entries(PLANETS).map(([id, planet]) => {
            const numId = parseInt(id);
            const { x, y } = getPlanetPosition(numId);
            const isUnlocked = numId <= maxUnlockedLevel;
            const isCompleted = numId < maxUnlockedLevel;
            const isCurrent = numId === maxUnlockedLevel;
            
            return (
              <div key={id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }} className="flex flex-col items-center z-10 w-32">
                <div className={`mb-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg z-20 border ${isUnlocked ? 'bg-orange-500 text-white border-orange-300' : 'bg-gray-700 text-gray-500 border-gray-600'}`}>{id}</div>
                <button onClick={() => { setSelectedPlanetId(numId); setShowPlanetInfo(true); }} className={`relative w-20 h-20 md:w-28 md:h-28 rounded-full transition-all duration-500 flex items-center justify-center group ${isUnlocked ? 'hover:scale-110 cursor-pointer' : 'grayscale opacity-60 cursor-not-allowed'}`}>
                  {isUnlocked && <div className="absolute inset-[-5px] rounded-full border border-white/20 blur-[2px] opacity-40" />}
                  <div className={`relative w-full h-full rounded-full flex items-center justify-center overflow-hidden ${isCurrent ? 'animate-planet-pulse ring-2 ring-indigo-400/50' : 'border border-white/5'}`}>
                    <TransparentImage src={planet.image} alt={planet.name} className="w-full h-full" />
                  </div>
                  {!isUnlocked && <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[1px]"><span className="text-xl">🔒</span></div>}
                </button>
                <div className="mt-2 flex gap-1">{[1, 2, 3].map((s) => (<span key={s} className={`text-xs ${isCompleted ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-gray-400 opacity-30'}`}>★</span>))}</div>
                <div className={`mt-1 text-center transition-all ${isUnlocked ? 'opacity-100' : 'opacity-50'}`}><span className="block text-[9px] font-black uppercase tracking-widest leading-tight text-white/90 drop-shadow-md">{planet.name}</span></div>
                {!planet.implemented && isUnlocked && (<div className="mt-1 bg-indigo-600/90 text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap shadow-xl">COMING SOON</div>)}
              </div>
            );
          })}

          <div className="absolute z-20 pointer-events-none transition-all duration-1000 ease-in-out" style={{ left: `${getPlanetPosition(maxUnlockedLevel).x - 15}%`, top: `${getPlanetPosition(maxUnlockedLevel).y - 12}%` }}>
            <div className="w-28 h-28 md:w-40 md:h-40">
              <TransparentImage src={MASCOT_IMAGE} alt="" className="w-full h-full animate-alien-float" />
            </div>
          </div>

          {/* Sara (Target/Friend) at Planet 10 */}
          <div className="absolute z-20 pointer-events-none" style={{ left: `${getPlanetPosition(10).x + 8}%`, top: `${getPlanetPosition(10).y - 12}%` }}>
            <div className="w-28 h-28 md:w-36 md:h-36">
              <TransparentImage src={SARA_IMAGE} alt="Sara" className="w-full h-full animate-alien-float" style={{ animationDelay: '1s' }} />
              <div className="bg-white/20 backdrop-blur-md text-[10px] font-black px-3 py-1 rounded-full mt-1 text-center whitespace-nowrap">HELP ME!</div>
            </div>
          </div>
        </div>

        <Modal isOpen={showPlanetInfo} onClose={() => setShowPlanetInfo(false)} title={selectedPlanetId ? PLANETS[selectedPlanetId].name.toUpperCase() : ''}>
          {selectedPlanetId && (
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-48 h-48 mb-8 animate-float"><TransparentImage src={PLANETS[selectedPlanetId].image} alt="" className={`w-full h-full ${!PLANETS[selectedPlanetId].implemented ? 'grayscale opacity-50' : ''}`} /></div>
              <div className="mb-8">
                <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Level {selectedPlanetId}</span>
                <p className="text-xl font-bold text-gray-800 dark:text-white mb-4">{PLANETS[selectedPlanetId].description}</p>
                <div className="flex flex-col gap-2 items-center"><span className="text-sm font-black text-gray-500 dark:text-white/50 uppercase tracking-tighter">Learning Objective</span><span className="text-lg font-black text-indigo-500 uppercase">{PLANETS[selectedPlanetId].objective}</span></div>
              </div>
              {!PLANETS[selectedPlanetId].implemented ? (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-6 rounded-3xl border border-yellow-200 dark:border-yellow-800/50 w-full mb-6">
                  <p className="font-black uppercase tracking-widest text-sm">Coming Soon!</p>
                  <p className="text-xs font-bold opacity-80 mt-2">Check back soon for new missions!</p>
                </div>
              ) : selectedPlanetId > maxUnlockedLevel ? (
                <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-3xl border border-red-200 dark:border-red-800/50 w-full mb-6 text-center">
                  <p className="font-black uppercase tracking-widest text-sm">Locked</p>
                  <p className="text-xs font-bold opacity-80 mt-2">Complete previous levels to unlock this planet!</p>
                </div>
              ) : (
                <Button onClick={() => { setLevel(selectedPlanetId); setMissionIndex(0); setGameState('playing'); setShowPlanetInfo(false); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-10 px-20 rounded-[40px] shadow-2xl transform transition-all active:scale-95 w-full">START MISSION 🚀</Button>
              )}
            </div>
          )}
        </Modal>
      </div>
    );
  };

  const renderDestinations = () => {
    if (level !== 3 || !currentMission || !currentMission.destinations || destinationPositions.length < currentMission.destinations.length) return null;
    return currentMission.destinations.map((dest, idx) => {
      const pos = destinationPositions[idx];
      return (
        <div key={`dest-${idx}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, dest)} onClick={() => draggedItem && onDrop(null, dest)} style={{ position: 'absolute', top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)', animation: level === 3 ? 'none' : `float 8s ease-in-out infinite alternate`, animationDelay: pos.delay }} className={`w-36 h-36 md:w-48 md:h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6 transition-all backdrop-blur-sm ${draggedItem ? 'border-indigo-400 bg-indigo-50/20 animate-pulse z-40' : 'border-white/20 bg-white/5 z-35'}`}>
          <TransparentImage src={ASSET_IMAGES[dest]} alt={dest} className="w-full h-full opacity-80" />
          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50 pointer-events-none">{dest === 'station' ? 'Space Station' : dest === 'purple-planet' ? 'Purple Planet' : dest === 'white-spaceship' ? 'Spaceship' : dest}</span>
        </div>
      );
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans text-white overflow-hidden relative`}>
      <div className="absolute inset-0 bg-fixed bg-center bg-cover scale-110 animate-space-bg" style={{ backgroundImage: `url(${SPACE_BG})` }} />
      <div className={`absolute inset-0 bg-black/60 backdrop-brightness-50 pointer-events-none z-0`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${PLANETS[level] ? PLANETS[level].color : ''} mix-blend-overlay pointer-events-none z-0`} />
      
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 bg-black/40 backdrop-blur-xl p-6 rounded-[30px] border border-white/10 relative z-50 mt-4 mx-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-2xl text-3xl">🚀</div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">GALAXY RESCUE</h1>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{maxUnlockedLevel}/10 COMPLETED</p>
              <div className="h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${(maxUnlockedLevel / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-full font-black text-xl shadow-lg flex items-center gap-2">⭐ {stars}</div>
          {gameState !== 'map' && <Button onClick={() => setGameState('map')} className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl">LEVEL MAP</Button>}
          <Button onClick={() => setIsSettingsOpen(true)} className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl">⚙️</Button>
          <Button onClick={() => navigate('/games')} className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl">EXIT</Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl flex flex-col items-center justify-center relative z-10 p-4">
        {gameState === 'map' && renderGalaxyMap()}
        {gameState === 'intro' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-xl animate-in zoom-in duration-500 z-50 border border-white/10">
            <div className="w-80 h-80 md:w-[400px] md:h-[400px] -mb-8 animate-alien-float">
              <TransparentImage src={MASCOT_IMAGE} alt="Mascot" className="w-full h-full brightness-125" />
            </div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Hi, I'm Mika!</h2>
            <p className="text-xl text-white/80 mb-8 font-medium italic leading-relaxed">"{MIKA_INTRO}"</p>
            <div className="flex flex-col gap-4 w-full">
              <Button onClick={() => setGameState('map')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-10 px-20 rounded-[40px] shadow-2xl transform transition-all active:scale-95">GO TO MAP 🌌</Button>
            </div>
          </div>
        )}
        {gameState === 'playing' && (
          <div className="flex-1 w-full relative">
            {decorativeObjects.map((obj, i) => (
              <div key={`decor-${i}`} draggable={level === 3} onDragStart={(e) => onDragStart(e, obj.type)} onClick={() => level === 3 ? setDraggedItem(prev => prev === obj.type ? null : obj.type) : processChoice(false)} style={{ position: 'absolute', top: obj.top, left: obj.left, transform: `translate(-50%, -50%) scale(${obj.scale})`, opacity: obj.opacity, cursor: 'pointer', zIndex: 25 }} className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-2 transition-all hover:scale-110 active:scale-95 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] ${draggedItem === obj.type ? 'drop-shadow-[0_0_40px_rgba(79,70,229,0.8)] scale-110 brightness-125' : ''}`}>
                <TransparentImage src={ASSET_IMAGES[obj.type]} alt="" className="w-full h-full animate-float" />
              </div>
            ))}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[450px] md:h-[450px] transition-all duration-500 ${isSpeaking ? 'scale-110' : 'scale-100'} z-20`}>
              <TransparentImage src={MASCOT_IMAGE} alt="Mascot" className={`w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.3)] brightness-110 contrast-105 ${isSpeaking ? 'animate-pulse' : 'animate-alien-float'}`} />
            </div>
            <button onClick={playInstruction} disabled={isSpeaking} className={`absolute top-[75%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50 z-30`}>🔊</button>
            {renderChoices()}
            {renderDestinations()}
            {feedback === 'wrong' && <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-10 py-5 rounded-[30px] font-black text-3xl shadow-2xl animate-bounce z-50">Try again, space hero! 💪</div>}
          </div>
        )}
        {gameState === 'feedback' && (
          <div className="flex flex-col items-center animate-in zoom-in duration-300 z-50">
             <div className="text-9xl mb-8 animate-bounce">✨</div>
             <h2 className="text-6xl font-black text-white mb-8 text-center drop-shadow-lg">AMAZING!</h2>
             <div className="bg-yellow-400 text-yellow-900 px-10 py-4 rounded-[30px] font-black text-4xl shadow-xl mb-12">+5 STARS ⭐</div>
             <Button onClick={handleNextMission} className="bg-blue-600 hover:bg-blue-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl transition-all active:scale-95">CONTINUE ➡️</Button>
          </div>
        )}
        {gameState === 'planet-unlock' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-xl animate-in fade-in duration-700 z-50 border border-white/10">
            <div className="text-9xl mb-8">🔓</div>
            <h2 className="text-4xl font-black mb-4">PLANET UNLOCKED!</h2>
            <p className="text-xl text-white/80 mb-8">Great job! You've earned enough stars to explore the next planet!</p>
            <div className="w-48 h-48 mb-10"><TransparentImage src={PLANETS[level + 1].image} alt="Planet" className="w-full h-full" /></div>
            <Button onClick={unlockNextPlanet} className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl">GO TO {PLANETS[level + 1].name.toUpperCase()} 🚀</Button>
          </div>
        )}
        {gameState === 'summary' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-10 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-2xl animate-in zoom-in duration-500 z-50 border border-white/10">
            <div className="flex gap-8 mb-4">
              <div className="w-48 h-48 md:w-64 md:h-64 animate-alien-float"><TransparentImage src={MASCOT_IMAGE} alt="Mika" className="w-full h-full brightness-125" /></div>
              <div className="w-48 h-48 md:w-64 md:h-64 animate-alien-float" style={{ animationDelay: '0.5s' }}><TransparentImage src={SARA_IMAGE} alt="Sara" className="w-full h-full brightness-125" /></div>
            </div>
            <h2 className="text-4xl font-black mb-2 uppercase tracking-tighter">Mission Accomplished!</h2>
            <p className="text-xl text-white/90 font-medium italic mb-8 px-4">"{MIKA_SUCCESS}"</p>
            <div className="grid grid-cols-2 gap-4 w-full mb-10">
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10"><p className="text-xs font-black text-indigo-300 uppercase mb-1">Total Stars</p><p className="text-4xl font-black text-white">{stars}</p></div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10"><p className="text-xs font-black text-green-300 uppercase mb-1">Accuracy</p><p className="text-4xl font-black text-white">{Math.round((stats.firstAttemptSuccess / stats.totalMissions) * 100) || 0}%</p></div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10"><p className="text-xs font-black text-yellow-400 uppercase mb-1">Missions</p><p className="text-4xl font-black text-white">{stats.totalMissions}</p></div>
              <div className="bg-white/5 p-6 rounded-3xl border-b-4 border-white/10"><p className="text-xs font-black text-purple-300 uppercase mb-1">Success Rate</p><p className="text-4xl font-black text-white">{stats.firstAttemptSuccess}</p></div>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Button onClick={() => navigate('/games')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl w-full">FINISH 🚀</Button>
              <Button onClick={resetGame} className="bg-white/10 hover:bg-white/20 text-white text-xl font-bold py-6 px-12 rounded-[30px] border border-white/20">PLAY AGAIN 🔄</Button>
            </div>
          </div>
        )}
      </main>

      {gameState === 'playing' && (
        <footer className="w-full max-w-4xl mt-8 relative z-50 p-4 md:p-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-black uppercase tracking-widest opacity-70">Mission {missionIndex + 1} of {missions.length}</span>
            <span className="text-xs font-black uppercase tracking-widest opacity-70">{missions.length ? Math.round(((missionIndex) / missions.length) * 100) : 0}% Complete</span>
          </div>
          <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${missions.length ? (missionIndex / missions.length) * 100 : 0}%` }} />
          </div>
        </footer>
      )}

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="GAME SETTINGS">
        <div className="p-6 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center"><label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Audio Speed</label><span className="bg-indigo-600 px-4 py-1 rounded-full text-sm font-black text-white">{speechRate.toFixed(2)}x</span></div>
            <input type="range" min="0.5" max="1.5" step="0.05" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase text-gray-500 dark:text-white"><span>Slower</span><span>Normal</span><span>Faster</span></div>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-lg font-bold text-gray-700 dark:text-white/70 uppercase tracking-widest">Voice Accent</label>
            <select value={speechVoice || ''} onChange={(e) => setSpeechVoice(e.target.value)} className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-2xl p-4 text-gray-900 dark:text-white font-bold outline-none focus:border-indigo-500 appearance-none">
              <option value="" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Default (Indian English)</option>
              {availableVoices.map((v) => (<option key={v.voiceURI} value={v.voiceURI} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">{v.name} ({v.lang})</option>))}
            </select>
          </div>
          <Button onClick={() => { speechService.speak("Testing audio", { rate: speechRate, voice: speechVoice }); }} className="bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-indigo-600 dark:text-white border border-gray-200 dark:border-white/10 py-4 rounded-2xl flex items-center justify-center gap-2">🔊 TEST AUDIO</Button>
          <Button onClick={resetGame} className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold">🔄 RESET PROGRESS</Button>
          <Button onClick={() => setIsSettingsOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-3xl font-black text-xl shadow-xl">SAVE & CLOSE</Button>
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 10px rgba(168,85,247,0.4)); } 50% { transform: scale(1.05); opacity: 0.8; filter: drop-shadow(0 0 20px rgba(168,85,247,0.8)); } }
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } 100% { transform: translateY(10px) rotate(-5deg); } }
        @keyframes alien-float { 0% { transform: translate(0, 0); } 33% { transform: translate(10px, -15px); } 66% { transform: translate(-10px, 10px); } 100% { transform: translate(0, 0); } }
        @keyframes space-bg { 0% { transform: scale(1.1) translate(0, 0); } 50% { transform: scale(1.15) translate(-1%, -1%); } 100% { transform: scale(1.1) translate(0, 0); } }
        @keyframes path-flow { 0% { stroke-dashoffset: 2; } 100% { stroke-dashoffset: 0; } }
        @keyframes planet-pulse { 0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(79, 70, 229, 0); } 100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); } }
        .animate-path-flow { animation: path-flow 30s linear infinite; }
        .bg-midnight-blue { background: radial-gradient(circle at center, #1a1a4a 0%, #05051a 100%); }
        .animate-planet-pulse { animation: planet-pulse 2s infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-pulse { animation: pulse 1.5s infinite; }
        .animate-float { animation: float 6s ease-in-out infinite alternate; }
        .animate-alien-float { animation: alien-float 8s ease-in-out infinite; }
        .animate-space-bg { animation: space-bg 30s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default GalaxyRescue;
