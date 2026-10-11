import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 * 
 * Displayed when the user navigates to a route that doesn't exist.
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-md w-full text-center">
        <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
