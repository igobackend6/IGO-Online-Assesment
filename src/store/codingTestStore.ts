import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_CODING_LANGUAGE } from '../lib/judge0Languages'
import type { CodingLanguage, CodingQuestion } from '../types'

// Round 2 duration is not specified by the spec — 60 minutes for 2 questions
// (one Medium, one Hard) is a deliberate, documented choice.
export const CODING_DURATION_SECONDS = 60 * 60

interface QuestionProgress {
  language: CodingLanguage
  code: Partial<Record<CodingLanguage, string>>
  submitted: boolean
}

interface CodingTestState {
  startedAt: number | null
  secondsRemaining: number
  currentQuestionIndex: number
  progress: Record<number, QuestionProgress>
  violationCount: number
  showViolationWarning: boolean
  roundSubmitted: boolean

  startRound: (questions: CodingQuestion[]) => void
  setCurrentQuestionIndex: (index: number) => void
  setLanguage: (questionId: number, language: CodingLanguage, starterCode: string) => void
  setCode: (questionId: number, language: CodingLanguage, code: string) => void
  markQuestionSubmitted: (questionId: number) => void
  registerViolation: () => number
  dismissViolationWarning: () => void
  tick: () => void
  markRoundSubmitted: () => void
  reset: () => void
}

const initialState = {
  startedAt: null as number | null,
  secondsRemaining: CODING_DURATION_SECONDS,
  currentQuestionIndex: 0,
  progress: {} as Record<number, QuestionProgress>,
  violationCount: 0,
  showViolationWarning: false,
  roundSubmitted: false,
}

export const useCodingTestStore = create<CodingTestState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startRound: (questions) => {
        if (get().startedAt !== null) return
        const progress: Record<number, QuestionProgress> = {}
        for (const question of questions) {
          progress[question.id] = {
            language: DEFAULT_CODING_LANGUAGE,
            code: { [DEFAULT_CODING_LANGUAGE]: question.starterCode[DEFAULT_CODING_LANGUAGE] },
            submitted: false,
          }
        }
        set({
          startedAt: Date.now(),
          secondsRemaining: CODING_DURATION_SECONDS,
          currentQuestionIndex: 0,
          progress,
        })
      },

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      setLanguage: (questionId, language, starterCode) => {
        set((state) => {
          const existing = state.progress[questionId]
          if (!existing) return state
          const hasCodeForLanguage = existing.code[language] !== undefined
          return {
            progress: {
              ...state.progress,
              [questionId]: {
                ...existing,
                language,
                code: hasCodeForLanguage
                  ? existing.code
                  : { ...existing.code, [language]: starterCode },
              },
            },
          }
        })
      },

      setCode: (questionId, language, code) => {
        set((state) => {
          const existing = state.progress[questionId]
          if (!existing) return state
          return {
            progress: {
              ...state.progress,
              [questionId]: {
                ...existing,
                code: { ...existing.code, [language]: code },
              },
            },
          }
        })
      },

      markQuestionSubmitted: (questionId) => {
        set((state) => {
          const existing = state.progress[questionId]
          if (!existing) return state
          return {
            progress: {
              ...state.progress,
              [questionId]: { ...existing, submitted: true },
            },
          }
        })
      },

      registerViolation: () => {
        const next = get().violationCount + 1
        set({ violationCount: next, showViolationWarning: next === 1 })
        return next
      },

      dismissViolationWarning: () => set({ showViolationWarning: false }),

      tick: () => {
        const { startedAt } = get()
        if (startedAt === null) return
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        set({ secondsRemaining: Math.max(0, CODING_DURATION_SECONDS - elapsed) })
      },

      markRoundSubmitted: () => set({ roundSubmitted: true }),

      reset: () => set({ ...initialState, progress: {} }),
    }),
    {
      name: 'coding-test',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
