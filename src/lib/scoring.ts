import questionsData from '../data/questions.json'
import type { AnswerMap, Question } from '../types'

export const questions = questionsData as Question[]

export interface ScoreResult {
  correct: number
  total: number
  percentage: number
}

export function calculateScore(answers: AnswerMap): ScoreResult {
  let correct = 0
  for (const question of questions) {
    if (answers[question.id] === question.correctAnswer) {
      correct += 1
    }
  }
  const total = questions.length
  return {
    correct,
    total,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 10000) / 100,
  }
}
