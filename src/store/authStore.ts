import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '../types'
import { validateCredentials } from '../services/authService'

interface AuthState {
  user: AuthUser | null
  studentId: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  setStudentId: (id: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      studentId: null,

      login: (email, password) => {
        const result = validateCredentials(email, password)
        if (!result) return false
        set({ user: result })
        return true
      },

      logout: () => set({ user: null, studentId: null }),

      setStudentId: (id) => set({ studentId: id }),
    }),
    {
      name: 'assessment-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
