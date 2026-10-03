'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/lib/api';

export interface User {
  id: string;
  mobile: string;
  first_name: string | null;
  last_name: string | null;
  national_code: string | null;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;
  otpPendingMobile: string | null;
  sendOtp: (mobile: string) => Promise<{ success: boolean; expiresIn: number; error?: string }>;
  verifyOtp: (mobile: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loadFromStorage: () => void;
  _markHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      otpPendingMobile: null,

      _markHydrated: () => set({ _hasHydrated: true }),

      sendOtp: async (mobile: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/send-otp', { mobile });
          const expiresIn = response.data?.expiresIn ?? 120;
          set({ otpPendingMobile: mobile, isLoading: false });
          return { success: true, expiresIn };
        } catch (error: any) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Failed to send OTP';
          set({ isLoading: false });
          return { success: false, expiresIn: 0, error: message };
        }
      },

      verifyOtp: async (mobile: string, code: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/verify-otp', { mobile, code });
          const { accessToken, user } = response.data ?? {};

          if (accessToken) {
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          }

          set({
            accessToken: accessToken ?? null,
            user: user ?? null,
            isAuthenticated: !!(accessToken && user),
            otpPendingMobile: null,
            isLoading: false,
          });

          return { success: true };
        } catch (error: any) {
          const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Invalid or expired OTP';
          set({ isLoading: false });
          return { success: false, error: message };
        }
      },

      logout: () => {
        delete api.defaults.headers.common.Authorization;
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          otpPendingMobile: null,
        });
      },

      loadFromStorage: () => {
        const token = get().accessToken;
        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          const user = get().user;
          set({
            isAuthenticated: !!(token && user),
            otpPendingMobile: null,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'eban-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('auth-store rehydrate failed', error);
        }
        if (state) {
          state.loadFromStorage();
          state._markHydrated();
        }
      },
    }
  )
);

export default useAuthStore;
