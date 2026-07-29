import { downloadCsv } from '../lib/csv'
import { codingQuestions } from '../data/codingQuestions'
import type { CodingSubmissionWithStudent } from '../types'

function formatTimeTakenShort(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function formatSubmittedDate(submittedAt: string): string {
  const date = new Date(submittedAt)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getQuestionTitle(questionId: number): string {
  return codingQuestions.find((question) => question.id === questionId)?.title ?? `Question ${questionId}`
}

export function exportQualifiedCodingStudentsCSV(data: CodingSubmissionWithStudent[]): void {
  const rows = data.map((submission) => ({
    Name: submission.coding_student?.name ?? 'Unknown',
    Email: submission.coding_student?.email ?? 'Unknown',
    Phone: submission.coding_student?.phone ?? 'Unknown',
    Department: submission.coding_student?.department ?? 'Unknown',
    Question: getQuestionTitle(submission.question_id),
    Language: submission.language,
    'Passed Test Cases': `${submission.passed_test_cases}/${submission.total_test_cases}`,
    Percentage: `${submission.percentage}%`,
    Time: formatTimeTakenShort(submission.time_taken),
    'Submitted Date': formatSubmittedDate(submission.submitted_at),
  }))

  downloadCsv('qualified_coding_students.csv', rows)
}
