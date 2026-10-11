import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { APP_NAME } from '../../config/app';

/**
 * App Layout Component
 * 
 * Provides a consistent layout shell with navigation header and main content area.
 * Uses React Router's <Outlet /> to render child routes.
 * 
 * Usage in App.jsx:
 *   <Route element={<AppLayout />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/settings" element={<Settings />} />
 *   </Route>
 * 
 * Customize the navigation items in the `navItems` array below.
 */

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* App Name / Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              <span>{APP_NAME}</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="sm:hidden flex border-t border-gray-200 dark:border-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 text-center py-2 text-xs font-medium transition-colors ${
                isActive(item.path)
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div>{item.icon}</div>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (optional — uncomment if needed) */}
      {/* <footer className="border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} {APP_NAME}
      </footer> */}
    </div>
  );
}

export default AppLayout;
