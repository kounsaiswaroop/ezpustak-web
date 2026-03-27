import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  isAuthenticated: boolean;
  adminPassword: string | null;
  login: (password: string) => void;
  logout: () => void;
}

export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminPassword: null,
      login: (password) => set({ isAuthenticated: true, adminPassword: password }),
      logout: () => set({ isAuthenticated: false, adminPassword: null }),
    }),
    {
      name: 'pageturn-admin-storage',
    }
  )
);
