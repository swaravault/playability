import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../assets/images/hero-kids.png';
import MoodTracker from '../components/features/MoodTracker';

const Sidebar = ({ isOpen, toggleSidebar, onMoodClick }) => {
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/about', active: true },
    { name: 'Games', icon: '🎮', path: '/games' },
    { name: 'Mood', icon: '😊', onClick: onMoodClick },
    // Removed Stories tab as requested
    { name: 'Progress', icon: '⭐', path: '#' },
    { name: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
          
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-72 bg-[#F8F9FF] dark:bg-[#0F172A] h-screen fixed left-0 top-0 flex flex-col p-8 border-r border-blue-50/50 dark:border-slate-800 transition-colors duration-300 z-50 shadow-2xl lg:shadow-none"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm shadow-yellow-200">
                  🖐️
                </div>
                <h1 className="text-2xl font-black tracking-tight flex">
                  <span className="text-[#3B42C4] dark:text-[#818CF8]">Play</span>
                  <span className="text-[#F43F5E]">Ability</span>
                </h1>
              </div>
              <button 
                onClick={toggleSidebar}
                className="lg:hidden text-2xl text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <nav className="flex-1 space-y-3">
              {navItems.map((item) => {
                const content = (
                  <>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-lg tracking-tight">{item.name}</span>
                  </>
                );
                const className = `flex items-center gap-4 px-5 py-4 rounded-[24px] w-full text-left font-bold transition-all ${
                  item.active 
                    ? 'bg-white dark:bg-[#1E293B] text-[#5D5FEF] dark:text-[#A5B4FC] shadow-[0_8px_20px_rgba(0,0,0,0.04)]' 
                    : 'text-gray-400 dark:text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-gray-600 dark:hover:text-slate-300'
                }`;

                if (item.onClick) {
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick();
                        if (window.innerWidth < 1024) toggleSidebar();
                      }}
                      className={className}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={className}
                  >
                    {content}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col items-center p-6 bg-white/40 dark:bg-slate-800/40 rounded-[35px] border border-blue-50 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/20 to-transparent dark:from-indigo-900/20 -z-10"></div>
              <div className="w-16 h-16 mb-2 relative">
                <span className="text-5xl">⭐</span>
                <div className="absolute -top-1 -right-1 text-xl animate-pulse">✨</div>
              </div>
              <p className="text-sm font-black text-blue-600 dark:text-indigo-400 text-center leading-tight">
                steps make<br/><span className="text-blue-800 dark:text-indigo-200">big progress!</span>
              </p>
              <div className="mt-3 flex gap-1">
                <div className="text-blue-400 text-xl">💙</div>
                <div className="text-blue-300 text-xl">💙</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const SkillCard = ({ title, subtitle, description, icon, color, darkColor, bgColor, darkBg }) => (
  <div className={`${bgColor} ${darkBg} p-8 rounded-[40px] border border-transparent hover:border-white dark:hover:border-slate-700 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col gap-4 relative overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-500`}>
    <div className="flex items-center gap-5">
      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <h3 className={`text-2xl font-black ${color} ${darkColor} tracking-tight`}>{title}</h3>
        <p className={`text-base font-bold ${color} ${darkColor} opacity-70 uppercase tracking-widest`}>{subtitle}</p>
      </div>
    </div>
    <p className="text-gray-500 dark:text-slate-400 font-bold leading-relaxed text-base">
      {description}
    </p>
  </div>
);

const About = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMoodOpen, setIsMoodOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex font-sans selection:bg-purple-100 dark:selection:bg-indigo-900 selection:text-purple-900 dark:selection:text-indigo-100 transition-colors duration-300">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        onMoodClick={() => setIsMoodOpen(true)} 
      />
      
      <main className={`flex-1 p-10 md:p-16 relative overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Menu Toggle Button */}
        <div className="absolute top-8 left-8 z-30">
          <button 
            onClick={toggleSidebar}
            className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-blue-50 dark:border-slate-700 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            title="Menu"
          >
            <span className="group-hover:rotate-12 transition-transform">☰</span>
          </button>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F5F7FF] dark:bg-[#1E293B]/30 rounded-full blur-[120px] -z-10 -mr-48 -mt-48 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFF5F7] dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10 -ml-24 -mb-24 opacity-60"></div>
        
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mb-24 relative pt-20 lg:pt-0">
            <div className="flex-1 text-left z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block bg-[#F3F0FF] dark:bg-indigo-950 text-[#7C3AED] dark:text-indigo-400 px-8 py-2.5 rounded-full font-black text-xl mb-8 shadow-sm"
              >
                About
              </motion.div>
              
              <h1 className="text-7xl md:text-[100px] font-black tracking-tighter mb-8 leading-[0.85] drop-shadow-sm">
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

              <p className="text-2xl md:text-3xl font-black text-[#1E293B] dark:text-slate-100 mb-6 leading-tight max-w-xl">
                Fun, visual games designed to build confidence, skills and brighter tomorrows.
              </p>
              
              <p className="text-xl text-[#64748B] dark:text-slate-400 font-bold max-w-lg mb-10 leading-relaxed opacity-80">
                PlayAbility is a safe, supportive and inclusive platform where children can explore, learn and grow through interactive games, stories and activities.
              </p>

              <div className="flex flex-wrap gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#5D5FEF] hover:bg-[#4F46E5] text-white font-black py-5 px-14 rounded-full text-2xl shadow-[0_15px_35px_rgba(93,95,239,0.3)] flex items-center gap-4 transition-all group cursor-pointer"
                  onClick={() => navigate('/games')}
                >
                  <span className="text-3xl">🎮</span> Let's Play <span className="group-hover:translate-x-2 transition-transform">→</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-slate-800 text-[#1E293B] dark:text-white font-black py-5 px-10 rounded-full text-2xl shadow-xl border-2 border-blue-50 dark:border-slate-700 flex items-center gap-4 transition-all group cursor-pointer"
                  onClick={() => setIsMoodOpen(true)}
                >
                  <span className="text-3xl">😊</span> How are you?
                </motion.button>
              </div>
            </div>

            <div className="flex-1 relative">
              {/* Generated Illustration blended into the page */}
              <div className="relative w-full aspect-square max-lg:max-w-md mx-auto lg:scale-110 flex items-center justify-center">
                {/* Circular soft background for blending */}
                <div className="absolute w-[120%] h-[120%] bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-white/0 dark:from-indigo-900/20 dark:via-slate-900/10 dark:to-transparent rounded-full blur-3xl -z-10 animate-pulse"></div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative w-full h-full p-4"
                >
                  {/* The image with a circular crop and soft edges */}
                  <div className="w-full h-full rounded-[50px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white/50 dark:border-slate-800/50 relative transition-colors duration-300">
                     <img 
                        src={heroImage} 
                        alt="Children learning together" 
                        className="w-full h-full object-cover scale-110"
                      />
                      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.3)]"></div>
                  </div>

                  {/* Decorative labels - adjusted for better visibility */}
                  <div className="absolute top-2 -right-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl border border-purple-100 dark:border-indigo-900/50 font-black text-sm lg:text-lg text-[#7C3AED] dark:text-indigo-300 rotate-12 z-20 transition-all">
                    Learn
                  </div>
                  <div className="absolute top-1/2 -right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl border border-blue-100 dark:border-slate-700/50 font-black text-sm lg:text-lg text-[#3B82F6] dark:text-blue-400 -rotate-6 z-20 transition-all">
                    Play
                  </div>
                  <div className="absolute bottom-2 -right-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl border border-pink-100 dark:border-rose-900/50 font-black text-sm lg:text-lg text-[#EC4899] dark:text-rose-400 rotate-3 z-20 transition-all">
                    Grow
                  </div>
                </motion.div>

                {/* Extra floating elements */}
                <div className="absolute -top-4 -left-4 text-4xl animate-float opacity-80">✨</div>
                <div className="absolute -bottom-4 -left-4 text-3xl animate-bounce opacity-60">🎈</div>
              </div>
            </div>
          </div>

          {/* Mood Popup */}
          <MoodTracker isOpen={isMoodOpen} onClose={() => setIsMoodOpen(false)} />

          {/* Skills Section */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-yellow-100">⭐</div>
              <h2 className="text-4xl font-black text-[#1E293B] dark:text-slate-100 tracking-tight">Designed to support key skills</h2>
            </div>
            <p className="text-xl text-[#64748B] dark:text-slate-400 font-bold mb-12 opacity-80">
              Our games and activities help children develop important skills through fun, hands-on learning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SkillCard 
                title="EXPRESS"
                subtitle="Visual Learning"
                description="Games designed around simple pictures, audio, text and small missions so every child can learn visually."
                icon="🎨"
                color="text-[#7C3AED]"
                darkColor="dark:text-indigo-300"
                bgColor="bg-[#F8F7FF]"
                darkBg="dark:bg-[#1E1B4B]/40"
              />
              <SkillCard 
                title="EMPOWER"
                subtitle="Dyslexia-Friendly"
                description="Features clean fonts, clear contrast, and picture-word matching like Picoword to help build reading confidence without stress."
                icon="🎮"
                color="text-[#059669]"
                darkColor="dark:text-emerald-300"
                bgColor="bg-[#F0FDF4]"
                darkBg="dark:bg-[#064E3B]/20"
              />
              <SkillCard 
                title="CONNECT"
                subtitle="Sound & Communication"
                description="It is learn through sounds and fun games. We combine visual cues with helpful audio to make connecting with words a blast!"
                icon="🔊"
                color="text-[#E11D48]"
                darkColor="dark:text-rose-300"
                bgColor="bg-[#FFF1F2]"
                darkBg="dark:bg-[#881337]/20"
              />
              <SkillCard 
                title="GROW"
                subtitle="Confidence & Progress"
                description="Build vocabulary, memory, and word recognition step-by-step through fun, interactive matching puzzles."
                icon="🌱"
                color="text-[#D97706]"
                darkColor="dark:text-amber-300"
                bgColor="bg-[#FFFBEB]"
                darkBg="dark:bg-[#78350F]/20"
              />
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default About;
