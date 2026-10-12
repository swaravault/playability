import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';

const About = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FFFDF0] p-6 md:p-12 flex flex-col items-center">
      {/* 
        ACCESSIBILITY NOTES:
        - Background #FFFDF0 (Cream) reduces visual stress for Dyslexia.
        - Text is left-aligned for easier tracking.
        - Tracking-wide (letter spacing) and leading-relaxed (line height) for readability.
        - Visual-first communication using large icons and emojis.
      */}
      
      <div className="max-w-4xl w-full bg-white rounded-[40px] p-8 md:p-16 shadow-xl border-b-8 border-blue-200">
        
        {/* Visual Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b-4 border-dashed border-yellow-200 pb-8">
          <div className="text-8xl animate-bounce">👋</div>
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2">
              <span className="text-[#FF5F5F]">P</span>
              <span className="text-[#FFB84C]">l</span>
              <span className="text-[#4D96FF]">a</span>
              <span className="text-[#6BCB77]">y</span>
              <span className="ml-4 text-gray-800">with</span>
            </h1>
            <h2 className="text-6xl md:text-8xl font-black text-purple-600 tracking-tight leading-none">
              Ability!
            </h2>
          </div>
        </div>

        {/* Motto Section */}
        <div className="mb-12">
          <p className="text-3xl md:text-4xl font-bold text-gray-700 leading-tight tracking-wide border-l-8 border-pink-400 pl-6">
            Our motto is to make fun <br/> 
            <span className="bg-yellow-200 px-2 text-gray-900">accessible for everyone.</span>
          </p>
        </div>

        {/* Feature Cards - Grid for Visual Chunking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-[#F0F7FF] p-8 rounded-3xl border-2 border-blue-100 flex flex-col gap-4 transform hover:translate-y-[-5px] transition-all">
            <div className="text-5xl">🎨</div>
            <h3 className="text-2xl font-black text-blue-700 uppercase tracking-widest">Express</h3>
            <p className="text-xl font-medium text-gray-600 leading-relaxed text-left">
              Express yourself with colors and shapes. No words needed to show your magic!
            </p>
          </div>

          <div className="bg-[#F2FFE9] p-8 rounded-3xl border-2 border-green-100 flex flex-col gap-4 transform hover:translate-y-[-5px] transition-all">
            <div className="text-5xl">🎮</div>
            <h3 className="text-2xl font-black text-green-700 uppercase tracking-widest">Empower</h3>
            <p className="text-xl font-medium text-gray-600 leading-relaxed text-left">
              Games designed for your unique way of playing. You are the hero of this story.
            </p>
          </div>

          <div className="bg-[#FFF0F0] p-8 rounded-3xl border-2 border-red-100 flex flex-col gap-4 transform hover:translate-y-[-5px] transition-all">
            <div className="text-5xl">🤟</div>
            <h3 className="text-2xl font-black text-red-700 uppercase tracking-widest">Connect</h3>
            <p className="text-xl font-medium text-gray-600 leading-relaxed text-left">
              A world of visual signs and happy faces. We speak the language of fun together.
            </p>
          </div>

          <div className="bg-[#FEF9E7] p-8 rounded-3xl border-2 border-yellow-100 flex flex-col gap-4 transform hover:translate-y-[-5px] transition-all">
            <div className="text-5xl">🚀</div>
            <h3 className="text-2xl font-black text-yellow-700 uppercase tracking-widest">Grow</h3>
            <h4 className="text-xl font-medium text-gray-600 leading-relaxed text-left">
              Build your brain power with visual challenges that make learning a blast.
            </h4>
          </div>

        </div>

        {/* Action Zone */}
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-12 pt-8 border-t-4 border-gray-100">
          <Button 
            className="bg-gray-800 hover:bg-gray-900 text-white font-black py-8 px-12 rounded-[30px] text-2xl shadow-xl transform active:scale-95 transition-all"
            onClick={() => window.history.back()}
          >
            ⬅️ GO BACK
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white font-black py-8 px-12 rounded-[30px] text-2xl shadow-xl transform active:scale-95 transition-all animate-pulse"
            onClick={() => navigate('/games')}
          >
            LET'S PLAY! 🚀
          </Button>
        </div>

      </div>

      {/* Visual Support Footer */}
      <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-80 grayscale-[0.2]">
        <span className="text-6xl animate-pulse">🌈</span>
        <span className="text-6xl">🎈</span>
        <span className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>🦄</span>
        <span className="text-6xl">🍭</span>
        <span className="text-6xl animate-pulse" style={{ animationDelay: '0.4s' }}>🧸</span>
      </div>
    </div>
  );
};

export default About;
