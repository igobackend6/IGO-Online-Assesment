import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AnswerMap } from '../types'

export const TEST_DURATION_SECONDS = 40 * 60

interface TestState {
  totalQuestions: number
  currentIndex: number
  answers: AnswerMap
  visited: Record<number, boolean>
  markedForReview: Record<number, boolean>
  secondsRemaining: number
  startedAt: number | null
  submitted: boolean

  startTest: (firstQuestionId: number, totalQuestions: number) => void
  goToQuestion: (index: number, questionId: number) => void
  setAnswer: (questionId: number, optionIndex: number) => void
  toggleReview: (questionId: number) => void
  tick: () => void
  markSubmitted: () => void
  reset: () => void
}

const initialState = {
  totalQuestions: 0,
  currentIndex: 0,
  answers: {} as AnswerMap,
  visited: {} as Record<number, boolean>,
  markedForReview: {} as Record<number, boolean>,
  secondsRemaining: TEST_DURATION_SECONDS,
  startedAt: null as number | null,
  submitted: false,
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startTest: (firstQuestionId, totalQuestions) => {
        if (get().startedAt !== null) return
        set({
          totalQuestions,
          currentIndex: 0,
          startedAt: Date.now(),
          secondsRemaining: TEST_DURATION_SECONDS,
          visited: { [firstQuestionId]: true },
        })
      },

      goToQuestion: (index, questionId) => {
        set((state) => ({
          currentIndex: index,
          visited: { ...state.visited, [questionId]: true },
        }))
      },

      setAnswer: (questionId, optionIndex) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionIndex },
          visited: { ...state.visited, [questionId]: true },
        }))
      },

      toggleReview: (questionId) => {
        set((state) => ({
          markedForReview: { ...state.markedForReview, [questionId]: !state.markedForReview[questionId] },
          visited: { ...state.visited, [questionId]: true },
        }))
      },

      tick: () => {
        const { startedAt } = get()
        if (startedAt === null) return
        const elapsed = Math.floor((Date.now() - startedAt) / 1000)
        set({ secondsRemaining: Math.max(0, TEST_DURATION_SECONDS - elapsed) })
      },

      markSubmitted: () => set({ submitted: true }),

      reset: () => set({ ...initialState, answers: {}, visited: {}, markedForReview: {} }),
    }),
    {
      name: 'assessment-test',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
