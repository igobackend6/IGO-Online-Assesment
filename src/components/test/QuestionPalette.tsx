import type { AnswerMap, Question } from '../../types'

interface QuestionPaletteProps {
  questions: Question[]
  currentIndex: number
  answers: AnswerMap
  visited: Record<number, boolean>
  markedForReview: Record<number, boolean>
  onNavigate: (index: number) => void
  disabled?: boolean
}

type PaletteStatus = 'current' | 'answered' | 'review' | 'answered-review' | 'not-answered' | 'not-visited'

const statusClasses: Record<PaletteStatus, string> = {
  current: 'bg-brand-600 text-white border-brand-600',
  answered: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  review: 'bg-violet-100 text-violet-800 border-violet-300',
  'answered-review': 'bg-violet-100 text-violet-800 border-violet-300',
  'not-answered': 'bg-red-50 text-red-700 border-red-200',
  'not-visited': 'bg-white text-ink-500 border-ink-200',
}

function getStatus(
  index: number,
  currentIndex: number,
  isAnswered: boolean,
  isMarked: boolean,
  isVisited: boolean,
): PaletteStatus {
  if (index === currentIndex) return 'current'
  if (isMarked && isAnswered) return 'answered-review'
  if (isMarked) return 'review'
  if (isAnswered) return 'answered'
  if (isVisited) return 'not-answered'
  return 'not-visited'
}

export function QuestionPalette({
  questions,
  currentIndex,
  answers,
  visited,
  markedForReview,
  onNavigate,
  disabled = false,
}: QuestionPaletteProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((question, index) => {
        const isAnswered = answers[question.id] !== undefined
        const isMarked = Boolean(markedForReview[question.id])
        const isVisited = Boolean(visited[question.id])
        const status = getStatus(index, currentIndex, isAnswered, isMarked, isVisited)

        return (
          <button
            key={question.id}
            type="button"
            disabled={disabled}
            onClick={() => onNavigate(index)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${statusClasses[status]}`}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}
