import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * Web Entry Point
 * 
 * Uses BrowserRouter for standard browser history API.
 * This file is used by app-web and serves as the reference implementation.
 * 
 * Platform-specific entry points:
 * - app-android/src/main.jsx → MemoryRouter
 * - app-ios/src/main.jsx → MemoryRouter
 * - app-macos/src/main.jsx → HashRouter
 * - app-windows/src/main.jsx → HashRouter
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
