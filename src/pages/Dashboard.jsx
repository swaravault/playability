import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

/**
 * Dashboard Page
 * 
 * Main landing page of the application.
 * Replace this with your actual dashboard content.
 */
function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            <Link
              to="/settings"
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to Your App</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This is a cross-platform application template. Edit the files in{' '}
            <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">src/</code>{' '}
            to build your application.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">📱 Platforms</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Web (Browser)</li>
                <li>• Android (Capacitor)</li>
                <li>• iOS (Capacitor)</li>
                <li>• macOS (Electron)</li>
                <li>• Windows (Electron)</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">🛠️ Tech Stack</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• React 19</li>
                <li>• Vite 6</li>
                <li>• Tailwind CSS 4</li>
                <li>• React Router 7</li>
                <li>• Zustand (state)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
