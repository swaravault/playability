import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui';
import speechService from '@/utils/speech';
import { useNavigate } from 'react-router-dom';

const MISSIONS = {
  1: [
    { id: '1-1', text: "Find the golden key", target: 'key', color: 'golden', choices: ['key', 'rocket', 'crystal'] },
    { id: '1-2', text: "Find the red apple", target: 'apple', color: 'red', choices: ['apple', 'leaf', 'star'] },
    { id: '1-3', text: "Find the blue star", target: 'star', color: 'blue', choices: ['star', 'moon', 'key'] },
    { id: '1-4', text: "Find the green leaf", target: 'leaf', color: 'green', choices: ['leaf', 'apple', 'crystal'] },
    { id: '1-5', text: "Find the yellow moon", target: 'moon', color: 'yellow', choices: ['moon', 'star', 'rocket'] },
  ],
  2: [
    { id: '2-1', text: "Find the blue crystal", target: 'crystal', color: 'blue', choices: ['crystal', 'key', 'rocket', 'alien'] },
    { id: '2-2', text: "Find the red rocket", target: 'rocket', color: 'red', choices: ['rocket', 'star', 'planet', 'key'] },
    { id: '2-3', text: "Find the yellow key", target: 'key', color: 'yellow', choices: ['key', 'crystal', 'alien', 'moon'] },
    { id: '2-4', text: "Find the green alien", target: 'alien', color: 'green', choices: ['alien', 'planet', 'rocket', 'star'] },
    { id: '2-5', text: "Find the purple planet", target: 'planet', color: 'purple', choices: ['planet', 'moon', 'crystal', 'key'] },
  ],
  3: [
    { 
      id: '3-1', 
      text: "Find the blue crystal and take it to the spaceship", 
      target: 'crystal', 
      color: 'blue', 
      destination: 'spaceship',
      choices: ['crystal', 'key', 'rocket'],
      destinations: ['spaceship', 'station', 'moon']
    },
    { 
      id: '3-2', 
      text: "Find the red star and place it beside the moon", 
      target: 'star', 
      color: 'red', 
      destination: 'moon',
      choices: ['star', 'apple', 'leaf'],
      destinations: ['moon', 'spaceship', 'planet']
    },
    { 
      id: '3-3', 
      text: "Find the golden key and move it to the space station", 
      target: 'key', 
      color: 'golden', 
      destination: 'station',
      choices: ['key', 'crystal', 'rocket'],
      destinations: ['station', 'moon', 'spaceship']
    },
  ]
};

const ASSET_IMAGES = {
  key: '/assets/games/galaxy-rescue/images/golden-key.png',
  rocket: '/assets/games/galaxy-rescue/images/red-rocket.png',
  crystal: '/assets/games/galaxy-rescue/images/blue-crystal.png',
  apple: '/assets/games/galaxy-rescue/images/red-apple.png',
  leaf: '/assets/games/galaxy-rescue/images/green-leaf.png',
  star: '/assets/games/galaxy-rescue/images/blue-star.png',
  moon: '/assets/games/galaxy-rescue/images/yellow-moon.png',
  alien: '/assets/games/galaxy-rescue/images/green-alien.png',
  planet: '/assets/games/galaxy-rescue/images/rainbow-planet.png',
  spaceship: '/assets/games/galaxy-rescue/images/spaceship.png',
  station: '/assets/games/galaxy-rescue/images/galaxy-station.png'
};

const MASCOT_IMAGE = '/assets/games/galaxy-rescue/images/mascot.png';
const SPACE_BG = '/assets/games/galaxy-rescue/images/space-bg.png';

const PLANETS = {
  1: { name: 'Rainbow Planet', image: '/assets/games/galaxy-rescue/images/rainbow-planet.png', color: 'from-pink-500/20 to-purple-500/20' },
  2: { name: 'Crystal Planet', image: '/assets/games/galaxy-rescue/images/crystal-planet.png', color: 'from-blue-500/20 to-cyan-500/20' },
  3: { name: 'Galaxy Station', image: '/assets/games/galaxy-rescue/images/galaxy-station.png', color: 'from-indigo-500/20 to-purple-800/20' }
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
        
        // If pixel is very dark, make it transparent
        if (r < 20 && g < 20 && b < 20) {
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
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'feedback', 'planet-unlock', 'summary'
  const [level, setLevel] = useState(1);
  const [missionIndex, setMissionIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [stats, setStats] = useState({
    totalMissions: 0,
    firstAttemptSuccess: 0,
    totalAttempts: 0
  });
  
  // Immersive floating positions
  const [objectPositions, setObjectPositions] = useState([]);
  const [destinationPositions, setDestinationPositions] = useState([]);

  // Drag and Drop state for Level 3
  const [draggedItem, setDraggedItem] = useState(null);

  const currentMission = useMemo(() => MISSIONS[level][missionIndex], [level, missionIndex]);

// Generate random positions for objects that avoid the center and each other
  const generatePositions = useCallback(() => {
    if (!currentMission) return;
    
    // Define safe zones (avoiding the center 30% of the screen)
    const zones = [
      { t: 10, l: 10, w: 30, h: 30 }, // Top Left
      { t: 10, l: 60, w: 30, h: 30 }, // Top Right
      { t: 60, l: 10, w: 30, h: 30 }, // Bottom Left
      { t: 60, l: 60, w: 30, h: 30 }, // Bottom Right
      { t: 35, l: 5, w: 20, h: 30 },  // Middle Left
      { t: 35, l: 75, w: 20, h: 30 }, // Middle Right
    ];

    const shuffledZones = [...zones].sort(() => Math.random() - 0.5);
    
    const positions = currentMission.choices.map((_, i) => {
      const zone = shuffledZones[i % shuffledZones.length];
      return {
        top: `${zone.t + Math.random() * zone.h}%`,
        left: `${zone.l + Math.random() * zone.w}%`,
        scale: 0.7 + Math.random() * 0.8, // 0.7x to 1.5x size
        delay: `${Math.random() * 5}s`,
        duration: `${8 + Math.random() * 6}s`
      };
    });
    setObjectPositions(positions);

    if (level === 3) {
      // For level 3, destinations also need distinct positions
      const destZones = shuffledZones.slice(currentMission.choices.length);
      const destPositions = currentMission.destinations.map((_, i) => {
        const zone = destZones[i % destZones.length];
        return {
          top: `${zone.t + Math.random() * zone.h}%`,
          left: `${zone.l + Math.random() * zone.w}%`,
          delay: `${Math.random() * 5}s`
        };
      });
      setDestinationPositions(destPositions);
    }
  }, [currentMission, level]);

  useEffect(() => {
    generatePositions();
  }, [generatePositions, missionIndex, level]);

  const playInstruction = useCallback(() => {
    if (!currentMission) return;
    setIsSpeaking(true);
    speechService.speak(currentMission.text, {
      onEnd: () => setIsSpeaking(false)
    });
  }, [currentMission]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setTimeout(() => {
        playInstruction();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, level, missionIndex, playInstruction]);

  const handleChoiceClick = (choice) => {
    if (gameState !== 'playing' || isSpeaking || level === 3) return;

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
      speechService.speak("Amazing! You found it!");
    } else {
      setFeedback('wrong');
      setAttempts(prev => prev + 1);
      speechService.speak("One more try, space hero!");
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
    if (objectPositions.length === 0) return null;

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
                transform: `scale(${pos.scale})`,
                animation: `float ${pos.duration} ease-in-out infinite alternate`,
                animationDelay: pos.delay
              }}
              className={`
                w-40 h-40 flex items-center justify-center p-2
                cursor-pointer transition-all hover:scale-110 active:scale-95
                drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]
                ${feedback === 'correct' && choice === currentMission.target ? 'drop-shadow-[0_0_30px_rgba(34,197,94,0.8)] scale-125' : ''}
                z-30
              `}
            >
              <TransparentImage 
                src={ASSET_IMAGES[choice]} 
                alt={choice} 
                className="w-full h-full object-contain brightness-110 contrast-105"
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
    if (level !== 3 || destinationPositions.length === 0) return null;
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
                animation: `float 8s ease-in-out infinite alternate`,
                animationDelay: pos.delay
              }}
              className={`
                w-48 h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center gap-2 p-6
                transition-all backdrop-blur-sm
                ${draggedItem ? 'border-indigo-400 bg-indigo-50/20 animate-pulse' : 'border-white/20 bg-white/5'}
              `}
            >
              <TransparentImage 
                src={ASSET_IMAGES[dest]} 
                alt={dest} 
                className="w-full h-full object-contain opacity-80 brightness-110 contrast-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML += '<span class="text-4xl">📍</span>';
                }}
              />
              <span className="text-[10px] font-bold uppercase tracking-tighter opacity-50">{dest}</span>
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

      {/* Overlay to ensure colors blend well */}
      <div className={`absolute inset-0 bg-gradient-to-b ${PLANETS[level].color} pointer-events-none z-0`} />
      
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
          <Button 
            onClick={() => navigate('/games')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl"
          >
            GO BACK
          </Button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative z-10 p-4 md:p-8">
        
        {gameState === 'intro' && (
          <div className="bg-black/60 backdrop-blur-xl text-white p-12 rounded-[50px] shadow-2xl flex flex-col items-center text-center max-w-xl animate-in zoom-in duration-500 z-50 border border-white/10">
            <div className="w-48 h-48 mb-8 animate-bounce">
              <TransparentImage src={MASCOT_IMAGE} alt="Mascot" className="w-full h-full object-contain brightness-125" />
            </div>
            <h2 className="text-4xl font-black mb-4">Welcome, Space Hero!</h2>
            <p className="text-xl text-white/80 mb-10 font-medium">
              Listen carefully to the instructions and help the alien find her way home!
            </p>
            <Button 
              onClick={() => setGameState('playing')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-10 px-20 rounded-[40px] shadow-2xl transform transition-all active:scale-95"
            >
              START MISSION 🚀
            </Button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="flex-1 w-full relative">
            {/* Alien Mascot (Center) */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 transition-all duration-500 ${isSpeaking ? 'scale-110' : 'scale-100'} z-20`}>
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
                absolute top-[70%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-2xl flex items-center justify-center text-3xl
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
              className="bg-white text-indigo-600 text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl"
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

            <Button 
              onClick={() => navigate('/games')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-3xl font-black py-8 px-16 rounded-[40px] shadow-2xl w-full"
            >
              FINISH 🚀
            </Button>
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
