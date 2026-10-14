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
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b-4 border-dashed border-yellow-200 pb-8 text-left">
          <div className="text-8xl animate-bounce">👋</div>
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-2">
              <span className="text-[#FF5F5F]">P</span>
              <span className="text-[#FFB84C]">l</span>
              <span className="text-[#4D96FF]">a</span>
              <span className="text-[#6BCB77]">y</span>
              <span className="text-[#9333EA]">A</span>
              <span className="text-[#DB2777]">b</span>
              <span className="text-[#EA580C]">i</span>
              <span className="text-[#2563EB]">l</span>
              <span className="text-[#059669]">i</span>
              <span className="text-[#7C3AED]">t</span>
              <span className="text-[#BE123C]">y</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gray-600 tracking-wide mt-4">
              Fun, visual games designed for dyslexic and hearing-impaired kids.
            </p>
          </div>
        </div>

        {/* Feature Cards - Grid for Visual Chunking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          <div className="bg-[#F0F7FF] p-8 rounded-3xl border-4 border-blue-200 flex flex-col gap-4 transform hover:scale-105 transition-all shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-5xl">🎨</div>
              <span className="bg-blue-200 text-blue-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">Visual Learning</span>
            </div>
            <h3 className="text-3xl font-black text-blue-700 uppercase tracking-widest">EXPRESS</h3>
            <p className="text-xl font-medium text-gray-700 leading-relaxed text-left">
              Games designed around pictures, symbols, and signs—not long texts or audio cues—so every child can learn visually.
            </p>
          </div>

          <div className="bg-[#F2FFE9] p-8 rounded-3xl border-4 border-green-200 flex flex-col gap-4 transform hover:scale-105 transition-all shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-5xl">🎮</div>
              <span className="bg-green-200 text-green-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">Dyslexia-Friendly</span>
            </div>
            <h3 className="text-3xl font-black text-green-700 uppercase tracking-widest">EMPOWER</h3>
            <p className="text-xl font-medium text-gray-700 leading-relaxed text-left">
              Features clean fonts, clear contrast, and picture-word matching like Picoword to help build reading confidence without stress.
            </p>
          </div>

          <div className="bg-[#FFF0F0] p-8 rounded-3xl border-4 border-red-200 flex flex-col gap-4 transform hover:scale-105 transition-all shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-5xl">🤟</div>
              <span className="bg-red-200 text-red-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">Connect Through Sound</span>
            </div>
            <h3 className="text-3xl font-black text-red-700 uppercase tracking-widest">CONNECT</h3>
            <p className="text-xl font-medium text-gray-700 leading-relaxed text-left">
              It is learn through sounds and fun games. We combine visual cues with helpful audio to make connecting with words a blast!
            </p>
          </div>

          <div className="bg-[#FEF9E7] p-8 rounded-3xl border-4 border-yellow-200 flex flex-col gap-4 transform hover:scale-105 transition-all shadow-lg">
            <div className="flex justify-between items-center">
              <div className="text-5xl">🚀</div>
              <span className="bg-yellow-200 text-yellow-800 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest">Learn Through Play</span>
            </div>
            <h3 className="text-3xl font-black text-yellow-700 uppercase tracking-widest">GROW</h3>
            <p className="text-xl font-medium text-gray-700 leading-relaxed text-left">
              Kids build vocabulary, memory, and word recognition step-by-step through fun, interactive matching puzzles.
            </p>
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
            className="bg-purple-600 hover:bg-purple-700 text-white font-black py-8 px-12 rounded-[30px] text-3xl shadow-xl transform active:scale-95 transition-all animate-pulse border-b-8 border-purple-800"
            onClick={() => navigate('/games')}
          >
            LET'S PLAY! 🚀
          </Button>
        </div>

      </div>

      {/* Visual Support Footer */}
      <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-80 grayscale-[0.1]">
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
