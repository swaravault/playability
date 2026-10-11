import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import './index.css';
import './native/capacitor-init';

/**
 * iOS Entry Point
 * 
 * Uses MemoryRouter because Capacitor's WebView doesn't support
 * the HTML5 History API (BrowserRouter would cause blank screens).
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </React.StrictMode>
);
