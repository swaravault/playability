import React from 'react';
import { Button } from '@/components/ui';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 via-pink-200 to-purple-300 p-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-6xl font-black mb-6 animate-bounce">
          <span className="text-red-500">P</span>
          <span className="text-orange-500">l</span>
          <span className="text-yellow-500">a</span>
          <span className="text-green-500">y</span>
          <span className="text-blue-500">a</span>
          <span className="text-indigo-500">b</span>
          <span className="text-purple-500">i</span>
          <span className="text-pink-500">l</span>
          <span className="text-red-500">i</span>
          <span className="text-orange-500">t</span>
          <span className="text-yellow-500">y</span>
          <span className="text-blue-500">!</span>
        </h1>
        
        <p className="text-2xl font-bold text-purple-700 mb-8 leading-relaxed">
          Welcome to the most magical world of learning and fun! 🚀
        </p>
        
        <div className="space-y-6 text-lg text-gray-700 font-medium">
          <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-yellow-300">
            <p>🌟 Playability is built just for YOU to explore, create, and learn while having a blast!</p>
          </div>
          
          <div className="bg-green-100 p-4 rounded-2xl border-2 border-green-300">
            <p>🎨 Express yourself with colors, games, and exciting challenges that make every day an adventure.</p>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-2xl border-2 border-blue-300">
            <p>🧠 Grow your brain power while playing with your favorite characters and friends!</p>
          </div>
        </div>

        <div className="mt-10 flex gap-4 justify-center">
          <Button 
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-6 px-10 rounded-full text-xl shadow-lg transform active:scale-95"
            onClick={() => window.history.back()}
          >
            Go Back! ⬅️
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-black py-6 px-10 rounded-full text-xl shadow-lg transform active:scale-95"
          >
            Let's Play! 🎮
          </Button>
        </div>
      </div>
      
      <div className="mt-12 flex gap-8 animate-pulse text-4xl">
        <span>🎈</span>
        <span>🧸</span>
        <span>🍦</span>
        <span>🌈</span>
        <span>🦄</span>
      </div>
    </div>
  );
};

export default About;
