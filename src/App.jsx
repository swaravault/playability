import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/layout/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Games from './pages/Games';
import PicoWord from './components/features/games/PicoWord';
import LingSixGame from './components/features/games/LingSixGame';
import GalaxyRescue from './components/features/games/GalaxyRescue';
import LetterDetective from './components/features/games/LetterDetective/LetterDetective';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

/**
 * Main App Component
 * 
 * This is the shared app component used by all platforms.
 * Platform-specific wrappers (in app-{platform}/src/main.jsx) provide
 * the appropriate router (BrowserRouter, MemoryRouter, or HashRouter).
 * 
 * Layout Options:
 *   Option A (current): Each page manages its own layout.
 *   Option B: Use AppLayout for a shared header/nav shell:
 *     import AppLayout from './components/layout/AppLayout';
 *     <Route element={<AppLayout />}>
 *       <Route path="/dashboard" element={<Dashboard />} />
 *       <Route path="/settings" element={<Settings />} />
 *     </Route>
 */
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/picoword" element={<PicoWord />} />
            <Route path="/games/ling-six" element={<LingSixGame />} />
            <Route path="/games/galaxy-rescue" element={<GalaxyRescue />} />
            <Route path="/games/letter-detective" element={<LetterDetective />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
