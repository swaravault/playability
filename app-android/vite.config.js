import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// Load app configuration
const configPath = path.resolve(__dirname, '../app.config.json');
const appConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Auto-generate version: (YEAR-2025).(MONTH).(DAY)
const now = new Date();
const autoVersion = `${now.getFullYear() - 2025}.${now.getMonth() + 1}.${now.getDate()}`;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
    // CRITICAL: Dedupe React and stateful libraries to prevent duplicate instances
    // This is essential when importing from ../src/ which has its own node_modules
    dedupe: ['react', 'react-dom', 'react-router-dom', 'zustand'],
  },
  // Inject app config as environment variables (read from app.config.json)
  // Version is auto-generated from today's date: (YEAR-2025).(MONTH).(DAY)
  define: {
    'import.meta.env.VITE_APP_NAME': JSON.stringify(appConfig.app.name),
    'import.meta.env.VITE_APP_DISPLAY_NAME': JSON.stringify(appConfig.app.displayName),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(autoVersion),
    'import.meta.env.VITE_BUILD_DATE': JSON.stringify(now.toISOString().split('T')[0]),
    'import.meta.env.VITE_DEVELOPER_NAME': JSON.stringify(appConfig.developer?.name || ''),
    'import.meta.env.VITE_DEVELOPER_EMAIL': JSON.stringify(appConfig.developer?.email || ''),
    'import.meta.env.VITE_DEVELOPER_MESSAGE': JSON.stringify(appConfig.developer?.message || ''),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
  },
});
