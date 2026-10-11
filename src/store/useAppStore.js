import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * App Store (Zustand)
 * 
 * Central application state management with localStorage persistence.
 * Add your app-specific state slices here.
 * 
 * Usage:
 *   import { useAppStore } from '@/store/useAppStore';
 * 
 *   // In a component:
 *   const user = useAppStore((state) => state.user);
 *   const setUser = useAppStore((state) => state.setUser);
 * 
 *   // Or destructure multiple values:
 *   const { user, isLoading, setUser } = useAppStore();
 * 
 * Persistence:
 *   State listed in the `partialize` function is automatically saved
 *   to localStorage and restored on app reload.
 */

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ─── User State ───────────────────────────────────────
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // ─── App State ────────────────────────────────────────
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // ─── Sidebar / UI State ───────────────────────────────
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // ─── Notifications ────────────────────────────────────
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { id: Date.now(), createdAt: new Date().toISOString(), ...notification },
          ],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      clearNotifications: () => set({ notifications: [] }),

      // ─── Reset ─────────────────────────────────────────────
      /** Reset all state to defaults (useful for logout) */
      reset: () =>
        set({
          user: null,
          isLoading: false,
          sidebarOpen: true,
          notifications: [],
        }),
    }),
    {
      name: 'app-store', // localStorage key
      // Only persist these fields (exclude transient state like isLoading)
      partialize: (state) => ({
        user: state.user,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export default useAppStore;
