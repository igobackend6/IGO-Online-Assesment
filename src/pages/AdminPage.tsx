import { useQuery } from '@tanstack/react-query'
import { fetchStudents } from '../services/studentService'
import { fetchQualifiedSubmissions, fetchSubmissionsWithStudents } from '../services/submissionService'
import { exportQualifiedStudentsCSV } from '../services/csvService'
import { fetchCodingStudents } from '../services/codingStudentService'
import {
  fetchCodingSubmissionsWithStudents,
  fetchQualifiedCodingSubmissions,
} from '../services/codingSubmissionService'
import { exportQualifiedCodingStudentsCSV } from '../services/codingCsvService'
import { codingQuestions } from '../data/codingQuestions'
import { calculateScore } from '../lib/scoring'
import { formatDuration } from '../lib/time'
import { downloadCsv } from '../lib/csv'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

function getCodingQuestionTitle(questionId: number): string {
  return codingQuestions.find((question) => question.id === questionId)?.title ?? `Question ${questionId}`
}

export function AdminPage() {
  const studentsQuery = useQuery({ queryKey: ['students'], queryFn: fetchStudents })
  const submissionsQuery = useQuery({
    queryKey: ['submissions'],
    queryFn: fetchSubmissionsWithStudents,
  })
  const qualifiedQuery = useQuery({
    queryKey: ['qualified-submissions'],
    queryFn: fetchQualifiedSubmissions,
  })
  const codingStudentsQuery = useQuery({
    queryKey: ['coding-students'],
    queryFn: fetchCodingStudents,
  })
  const codingSubmissionsQuery = useQuery({
    queryKey: ['coding-submissions'],
    queryFn: fetchCodingSubmissionsWithStudents,
  })
  const qualifiedCodingQuery = useQuery({
    queryKey: ['qualified-coding-submissions'],
    queryFn: fetchQualifiedCodingSubmissions,
  })

  function exportStudentsCsv() {
    const rows = (studentsQuery.data ?? []).map((student) => ({
      Name: student.name,
      Email: student.email,
      Phone: student.phone,
      Department: student.department,
      'Login Email': student.login_email,
      'Registered At': new Date(student.created_at).toLocaleString(),
    }))
    downloadCsv('students.csv', rows)
  }

  function exportSubmissionsCsv() {
    const rows = (submissionsQuery.data ?? []).map((submission) => {
      const score = calculateScore(submission.answers_json)
      return {
        Name: submission.student?.name ?? 'Unknown',
        Email: submission.student?.email ?? 'Unknown',
        Department: submission.student?.department ?? 'Unknown',
        Score: `${score.correct}/${score.total}`,
        Percentage: `${score.percentage}%`,
        'Time Taken': formatDuration(submission.time_taken),
        'Submitted At': new Date(submission.submitted_at).toLocaleString(),
      }
    })
    downloadCsv('submissions.csv', rows)
  }

  function exportQualifiedCsv() {
    if (!qualifiedQuery.data?.length) return
    exportQualifiedStudentsCSV(qualifiedQuery.data)
  }

  function exportQualifiedCodingCsv() {
    if (!qualifiedCodingQuery.data?.length) return
    exportQualifiedCodingStudentsCSV(qualifiedCodingQuery.data)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">
          Review registered candidates and their assessment submissions.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">
            Students ({studentsQuery.data?.length ?? 0})
          </h2>
          <Button
            variant="secondary"
            onClick={exportStudentsCsv}
            disabled={!studentsQuery.data?.length}
          >
            Export CSV
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Registered</th>
              </tr>
            </thead>
            <tbody>
              {studentsQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    Loading students…
                  </td>
                </tr>
              )}
              {studentsQuery.isError && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-red-600">
                    Failed to load students.
                  </td>
                </tr>
              )}
              {studentsQuery.data?.map((student) => (
                <tr key={student.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink-900">{student.name}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.email}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.phone}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.department}</td>
                  <td className="py-3 pr-4 text-ink-500">
                    {new Date(student.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!studentsQuery.isLoading && studentsQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    No students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">
            Submissions ({submissionsQuery.data?.length ?? 0})
          </h2>
          <Button
            variant="secondary"
            onClick={exportSubmissionsCsv}
            disabled={!submissionsQuery.data?.length}
          >
            Export CSV
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Time taken</th>
                <th className="py-2 pr-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {submissionsQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    Loading submissions…
                  </td>
                </tr>
              )}
              {submissionsQuery.isError && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-red-600">
                    Failed to load submissions.
                  </td>
                </tr>
              )}
              {submissionsQuery.data?.map((submission) => {
                const score = calculateScore(submission.answers_json)
                return (
                  <tr key={submission.id} className="border-b border-ink-100 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-ink-900">
                        {submission.student?.name ?? 'Unknown'}
                      </div>
                      <div className="text-xs text-ink-500">{submission.student?.email}</div>
                    </td>
                    <td className="py-3 pr-4 text-ink-600">
                      {submission.student?.department ?? '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={score.percentage >= 50 ? 'success' : 'warning'}>
                        {score.correct}/{score.total} ({score.percentage}%)
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-ink-600">{formatDuration(submission.time_taken)}</td>
                    <td className="py-3 pr-4 text-ink-500">
                      {new Date(submission.submitted_at).toLocaleString()}
                    </td>
                  </tr>
                )
              })}
              {!submissionsQuery.isLoading && submissionsQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    No submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">
            Qualified Students ({qualifiedQuery.data?.length ?? 0})
          </h2>
          <Button
            variant="secondary"
            onClick={exportQualifiedCsv}
            disabled={!qualifiedQuery.data?.length}
          >
            Export Qualified Students CSV
          </Button>
        </div>
        <p className="mt-1 text-xs text-ink-500">Candidates scoring 75% or higher.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4">Percentage</th>
                <th className="py-2 pr-4">Time taken</th>
                <th className="py-2 pr-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {qualifiedQuery.isLoading && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-ink-400">
                    Loading qualified students…
                  </td>
                </tr>
              )}
              {qualifiedQuery.isError && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-red-600">
                    Failed to load qualified students.
                  </td>
                </tr>
              )}
              {qualifiedQuery.data?.map((submission) => (
                <tr key={submission.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900">
                        {submission.student?.name ?? 'Unknown'}
                      </span>
                      <Badge tone="success">Qualified</Badge>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{submission.student?.email}</td>
                  <td className="py-3 pr-4 text-ink-600">{submission.student?.phone}</td>
                  <td className="py-3 pr-4 text-ink-600">
                    {submission.student?.department ?? '—'}
                  </td>
                  <td className="py-3 pr-4 text-ink-600">
                    {submission.score}/{submission.total_questions}
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{submission.percentage}%</td>
                  <td className="py-3 pr-4 text-ink-600">{formatDuration(submission.time_taken)}</td>
                  <td className="py-3 pr-4 text-ink-500">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!qualifiedQuery.isLoading && qualifiedQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-ink-400">
                    No qualified students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-ink-900">Round 2 — Live Coding</h2>
        <p className="mt-1 text-sm text-ink-500">Coding assessment registrations and submissions.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-ink-900">
          Coding Registered Students ({codingStudentsQuery.data?.length ?? 0})
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Registered Time</th>
              </tr>
            </thead>
            <tbody>
              {codingStudentsQuery.isLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    Loading coding students…
                  </td>
                </tr>
              )}
              {codingStudentsQuery.isError && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-red-600">
                    Failed to load coding students.
                  </td>
                </tr>
              )}
              {codingStudentsQuery.data?.map((student) => (
                <tr key={student.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink-900">{student.name}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.email}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.phone}</td>
                  <td className="py-3 pr-4 text-ink-600">{student.department}</td>
                  <td className="py-3 pr-4 text-ink-500">
                    {new Date(student.registered_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!codingStudentsQuery.isLoading && codingStudentsQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-ink-400">
                    No coding students registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-semibold text-ink-900">
          Coding Submissions ({codingSubmissionsQuery.data?.length ?? 0})
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Student</th>
                <th className="py-2 pr-4">Question</th>
                <th className="py-2 pr-4">Language</th>
                <th className="py-2 pr-4">Passed</th>
                <th className="py-2 pr-4">Percentage</th>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {codingSubmissionsQuery.isLoading && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-ink-400">
                    Loading coding submissions…
                  </td>
                </tr>
              )}
              {codingSubmissionsQuery.isError && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-red-600">
                    Failed to load coding submissions.
                  </td>
                </tr>
              )}
              {codingSubmissionsQuery.data?.map((submission) => (
                <tr key={submission.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-ink-900">
                      {submission.coding_student?.name ?? 'Unknown'}
                    </div>
                    <div className="text-xs text-ink-500">{submission.coding_student?.email}</div>
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{getCodingQuestionTitle(submission.question_id)}</td>
                  <td className="py-3 pr-4 capitalize text-ink-600">{submission.language}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={submission.passed_test_cases >= 8 ? 'success' : 'warning'}>
                      {submission.passed_test_cases}/{submission.total_test_cases}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{submission.percentage}%</td>
                  <td className="py-3 pr-4 text-ink-600">{formatDuration(submission.time_taken)}</td>
                  <td className="py-3 pr-4 text-ink-500">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!codingSubmissionsQuery.isLoading && codingSubmissionsQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-ink-400">
                    No coding submissions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-900">
            Coding Qualified Students ({qualifiedCodingQuery.data?.length ?? 0})
          </h2>
          <Button
            variant="secondary"
            onClick={exportQualifiedCodingCsv}
            disabled={!qualifiedCodingQuery.data?.length}
          >
            Export Qualified Coding Students CSV
          </Button>
        </div>
        <p className="mt-1 text-xs text-ink-500">Candidates passing at least 8 of 10 test cases.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Question</th>
                <th className="py-2 pr-4">Passed</th>
                <th className="py-2 pr-4">Percentage</th>
                <th className="py-2 pr-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {qualifiedCodingQuery.isLoading && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-ink-400">
                    Loading qualified coding students…
                  </td>
                </tr>
              )}
              {qualifiedCodingQuery.isError && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-red-600">
                    Failed to load qualified coding students.
                  </td>
                </tr>
              )}
              {qualifiedCodingQuery.data?.map((submission) => (
                <tr key={submission.id} className="border-b border-ink-100 last:border-0">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-ink-900">
                        {submission.coding_student?.name ?? 'Unknown'}
                      </span>
                      <Badge tone="success">Qualified</Badge>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{submission.coding_student?.email}</td>
                  <td className="py-3 pr-4 text-ink-600">{submission.coding_student?.phone}</td>
                  <td className="py-3 pr-4 text-ink-600">
                    {submission.coding_student?.department ?? '—'}
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{getCodingQuestionTitle(submission.question_id)}</td>
                  <td className="py-3 pr-4 text-ink-600">
                    {submission.passed_test_cases}/{submission.total_test_cases}
                  </td>
                  <td className="py-3 pr-4 text-ink-600">{submission.percentage}%</td>
                  <td className="py-3 pr-4 text-ink-600">{formatDuration(submission.time_taken)}</td>
                </tr>
              ))}
              {!qualifiedCodingQuery.isLoading && qualifiedCodingQuery.data?.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-ink-400">
                    No qualified coding students yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
