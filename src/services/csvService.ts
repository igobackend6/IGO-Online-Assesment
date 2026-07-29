import { downloadCsv } from '../lib/csv'
import type { SubmissionWithStudent } from '../types'

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

export function exportQualifiedStudentsCSV(data: SubmissionWithStudent[]): void {
  const rows = data.map((submission) => ({
    Name: submission.student?.name ?? 'Unknown',
    Email: submission.student?.email ?? 'Unknown',
    Phone: submission.student?.phone ?? 'Unknown',
    Department: submission.student?.department ?? 'Unknown',
    Score: submission.score,
    'Total Questions': submission.total_questions,
    Percentage: `${submission.percentage}%`,
    'Time Taken': formatTimeTakenShort(submission.time_taken),
    'Submitted Date': formatSubmittedDate(submission.submitted_at),
  }))

  downloadCsv('qualified_students.csv', rows)
}
