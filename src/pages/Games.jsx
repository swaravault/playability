import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

const Games = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'picoword',
      title: 'PicoWord',
      description: 'Match the picture with the word!',
      icon: '🖼️',
      color: 'bg-purple-100 border-purple-200 text-purple-700',
      path: '/games/picoword'
    },
    {
      id: 'lingsix',
      title: 'Ling Six Test',
      description: 'Listen and identify the six Ling sounds!',
      icon: '👂',
      color: 'bg-blue-100 border-blue-200 text-blue-700',
      path: '/games/ling-six'
    },
    {
      id: 'galaxyrescue',
      title: 'Galaxy Rescue',
      description: 'Rescue friends in space by listening carefully!',
      icon: '🚀',
      color: 'bg-indigo-100 border-indigo-200 text-indigo-700',
      path: '/games/galaxy-rescue'
    },
    // Future games can be added here
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF0] p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-[40px] p-8 md:p-12 shadow-xl border-b-8 border-blue-200">
        
        <header className="flex justify-between items-center mb-12 border-b-4 border-dashed border-yellow-200 pb-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight text-gray-800">
              Choose a <span className="text-blue-500">Game</span>
            </h1>
            <p className="text-2xl font-bold text-gray-500 mt-2">What do you want to play today?</p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-2xl font-bold h-16 px-8 text-xl"
            onClick={() => navigate('/about')}
          >
            ⬅️ Back
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game) => (
            <div 
              key={game.id}
              onClick={() => navigate(game.path)}
              className={`
                cursor-pointer p-8 rounded-[35px] border-4 transition-all transform hover:scale-105 active:scale-95
                flex flex-col items-start gap-4 shadow-lg hover:shadow-2xl
                ${game.color}
              `}
            >
              <div className="text-7xl mb-2">{game.icon}</div>
              <h2 className="text-4xl font-black uppercase tracking-tight">{game.title}</h2>
              <p className="text-xl font-bold opacity-80 leading-tight">
                {game.description}
              </p>
              <div className="mt-4 bg-white/50 backdrop-blur-sm rounded-2xl py-3 px-6 font-black text-xl">
                PLAY NOW! 🚀
              </div>
            </div>
          ))}
          
          {/* Placeholder for coming soon */}
          <div className="p-8 rounded-[35px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center opacity-40 grayscale">
            <div className="text-7xl mb-2">🎁</div>
            <h2 className="text-2xl font-black text-gray-400">NEW GAMES SOON!</h2>
          </div>
        </div>

      </div>

      <div className="mt-12 flex gap-8 animate-pulse text-4xl grayscale opacity-50">
        <span>🚀</span>
        <span>🧩</span>
        <span>🎨</span>
      </div>
    </div>
  );
};

export default Games;
