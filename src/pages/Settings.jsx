import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import APP_CONFIG, { APP_NAME, APP_VERSION, DEVELOPER_INFO } from '../config/app';
import { getPlatform } from '../utils/platform';

/**
 * Settings Page
 * 
 * Application settings and preferences with About section.
 */
function Settings() {
  const { theme, setTheme } = useTheme();
  const platform = getPlatform();

  // Format platform name for display
  const platformDisplay = {
    desktop: 'Desktop (Electron)',
    android: 'Android',
    ios: 'iOS',
    web: 'Web Browser',
  }[platform] || platform;

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-[#020617] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/about"
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-transparent dark:border-slate-800">
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Choose your preferred color scheme
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-transparent dark:border-slate-800">
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold">About</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {/* Developer Info */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl">
                  👨‍💻
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-slate-100">
                    Developer
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 mt-1">
                    {DEVELOPER_INFO.name}{' '}
                    <a
                      href={`mailto:${DEVELOPER_INFO.email}`}
                      className="text-blue-500 hover:text-blue-600 dark:text-indigo-400"
                    >
                      {`<${DEVELOPER_INFO.email}>`}
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 italic">
                    {DEVELOPER_INFO.message}
                  </p>
                </div>
              </div>
            </div>

            {/* App Name */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
                    📱
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-slate-100">
                      App Name
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Application identifier
                    </p>
                  </div>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {APP_NAME}
                </span>
              </div>
            </div>

            {/* Version Number */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl">
                    🏷️
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-slate-100">
                      Version
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Current app version
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-mono font-semibold text-gray-900 dark:text-slate-100">
                    v{APP_VERSION}
                  </span>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                    Platform: {platformDisplay}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Version Format Info */}
        <div className="text-center text-sm text-gray-400 dark:text-slate-500 pb-8">
          <p>
            Version format: <code className="bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">x.y.z</code>
            {' '}where x = year-2025, y = month, z = day
          </p>
        </div>
      </main>
    </div>
  );
}

export default Settings;
