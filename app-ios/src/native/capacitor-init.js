/**
 * Capacitor Native Plugin Initialization (iOS)
 * 
 * Initialize native plugins when the app starts.
 * This file is imported by main.jsx.
 */

import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

/**
 * Initialize native plugins
 */
async function initializeCapacitor() {
  try {
    // Hide splash screen after app is ready
    await SplashScreen.hide();

    // Configure status bar
    await StatusBar.setStyle({ style: Style.Default });

    // Configure keyboard behavior
    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.classList.add('keyboard-visible');
      document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.classList.remove('keyboard-visible');
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    });

    console.log('Capacitor plugins initialized (iOS)');
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'complete') {
  initializeCapacitor();
} else {
  document.addEventListener('DOMContentLoaded', initializeCapacitor);
}
