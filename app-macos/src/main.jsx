import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from '@web/App';
import { ThemeProvider } from '@web/context/ThemeContext';
import './index.css';

/**
 * macOS Desktop Entry Point
 * 
 * Uses HashRouter because Electron loads from file:// protocol in production,
 * which doesn't support the HTML5 History API.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
