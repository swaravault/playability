/**
 * Electron API Type Declarations (Windows)
 * 
 * Provides TypeScript types for the electronAPI exposed via preload script.
 * Import this in renderer-side TypeScript files for type safety.
 */

export interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  onMenuAction: (callback: (action: string) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
