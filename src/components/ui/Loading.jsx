/**
 * Loading Component
 * 
 * Displays a loading spinner with optional message.
 * Can be used as a full-page loader or inline spinner.
 * 
 * Props:
 *   message  — string, optional loading message
 *   fullPage — boolean, centers in viewport (default: false)
 *   size     — 'sm' | 'md' | 'lg' (default: 'md')
 * 
 * Usage:
 *   <Loading />
 *   <Loading message="Loading data..." fullPage />
 *   <Loading size="sm" />
 */

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

function Loading({ message, fullPage = false, size = 'md' }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <svg
        className={`animate-spin ${sizeMap[size] || sizeMap.md} text-blue-500`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {message && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinner}
    </div>
  );
}

export default Loading;
