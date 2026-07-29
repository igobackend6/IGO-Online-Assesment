import { useQuery } from '@tanstack/react-query'
import { fetchSubmissionHistory } from '../../services/codingSubmissionService'
import { formatDuration } from '../../lib/time'
import { Badge } from '../ui/Badge'

interface SubmissionsTabProps {
  codingStudentId: string
  questionId: number
}

export function SubmissionsTab({ codingStudentId, questionId }: SubmissionsTabProps) {
  const query = useQuery({
    queryKey: ['coding-submission-history', codingStudentId, questionId],
    queryFn: () => fetchSubmissionHistory(codingStudentId, questionId),
  })

  if (query.isLoading) {
    return <p className="p-5 text-sm text-ink-400">Loading submissions…</p>
  }

  if (query.isError) {
    return <p className="p-5 text-sm text-red-600">Failed to load submissions.</p>
  }

  if (!query.data || query.data.length === 0) {
    return <p className="p-5 text-sm text-ink-400">No submissions yet for this question.</p>
  }

  return (
    <div className="flex flex-col gap-2 p-5">
      {query.data.map((submission) => (
        <div
          key={submission.id}
          className="flex items-center justify-between rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs"
        >
          <div className="flex items-center gap-2">
            <Badge tone={submission.passed_test_cases >= 8 ? 'success' : 'warning'}>
              {submission.passed_test_cases}/{submission.total_test_cases}
            </Badge>
            <span className="capitalize text-ink-600">{submission.language}</span>
          </div>
          <div className="flex items-center gap-3 text-ink-500">
            <span>{formatDuration(submission.time_taken)}</span>
            <span>{new Date(submission.submitted_at).toLocaleTimeString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
