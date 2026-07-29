import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { validateCodingCredentials } from '../services/codingAuthService'

interface CodingAuthState {
  isAuthenticated: boolean
  codingStudentId: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
  setCodingStudentId: (id: string) => void
}

export const useCodingAuthStore = create<CodingAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      codingStudentId: null,

      login: (email, password) => {
        const success = validateCodingCredentials(email, password)
        if (success) set({ isAuthenticated: true })
        return success
      },

      logout: () => set({ isAuthenticated: false, codingStudentId: null }),

      setCodingStudentId: (id) => set({ codingStudentId: id }),
    }),
    {
      name: 'coding-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
