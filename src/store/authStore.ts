import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  hydrated: boolean
  setAuth: (payload: { user: AuthUser; token: string }) => void
  clear: () => void
  setStatus: (status: AuthStatus) => void
  markHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      status: 'idle',
      hydrated: false,
      setAuth: ({ user, token }) =>
        set({
          user,
          token,
          status: 'authenticated',
        }),
      clear: () =>
        set({
          user: null,
          token: null,
          status: 'unauthenticated',
        }),
      setStatus: (status) =>
        set({
          status,
        }),
      markHydrated: () =>
        set({
          hydrated: true,
        }),
    }),
    {
      name: 'provisio-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ user, token, status }) => ({ user, token, status }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return
        }
        const hasSession = Boolean(state.user && state.token)
        state.setStatus(hasSession ? 'authenticated' : 'unauthenticated')
        state.markHydrated()
      },
    },
  ),
)
