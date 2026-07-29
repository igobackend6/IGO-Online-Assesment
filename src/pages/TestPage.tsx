import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTestStore, TEST_DURATION_SECONDS } from '../store/testStore'
import { useTimer } from '../hooks/useTimer'
import { calculateScore, questions } from '../lib/scoring'
import { createSubmission } from '../services/submissionService'
import { TimerDisplay } from '../components/test/TimerDisplay'
import { QuestionCard } from '../components/test/QuestionCard'
import { QuestionPalette } from '../components/test/QuestionPalette'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'

export function TestPage() {
  const navigate = useNavigate()
  const studentId = useAuthStore((state) => state.studentId)

  const currentIndex = useTestStore((state) => state.currentIndex)
  const answers = useTestStore((state) => state.answers)
  const visited = useTestStore((state) => state.visited)
  const markedForReview = useTestStore((state) => state.markedForReview)
  const startedAt = useTestStore((state) => state.startedAt)
  const submitted = useTestStore((state) => state.submitted)
  const goToQuestion = useTestStore((state) => state.goToQuestion)
  const setAnswer = useTestStore((state) => state.setAnswer)
  const toggleReview = useTestStore((state) => state.toggleReview)
  const markSubmitted = useTestStore((state) => state.markSubmitted)

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const submitLockRef = useRef(false)

  const currentQuestion = questions[currentIndex]

  const handleSubmit = useCallback(async () => {
    if (!studentId || submitLockRef.current) return
    submitLockRef.current = true
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const timeTaken = startedAt
        ? Math.round((Date.now() - startedAt) / 1000)
        : TEST_DURATION_SECONDS
      const score = calculateScore(answers)
      await createSubmission(
        studentId,
        answers,
        Math.min(timeTaken, TEST_DURATION_SECONDS),
        score.correct,
        score.total,
        score.percentage,
      )
      markSubmitted()
      navigate('/completed', { replace: true })
    } catch (error) {
      submitLockRef.current = false
      setIsSubmitting(false)
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.')
    }
  }, [studentId, startedAt, answers, markSubmitted, navigate])

  const secondsRemaining = useTimer(handleSubmit)

  useEffect(() => {
    if (!studentId || startedAt === null) {
      navigate('/instructions', { replace: true })
      return
    }
    if (submitted) {
      navigate('/completed', { replace: true })
    }
  }, [studentId, startedAt, submitted, navigate])

  if (!currentQuestion) return null

  const answeredCount = Object.keys(answers).length
  const isLocked = submitted || isSubmitting || secondsRemaining <= 0

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="text-base font-semibold text-ink-900">Assessment in progress</span>
          <TimerDisplay secondsRemaining={secondsRemaining} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIndex + 1}
              selectedOption={answers[currentQuestion.id]}
              onSelect={(optionIndex) => setAnswer(currentQuestion.id, optionIndex)}
              disabled={isLocked}
            />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              disabled={currentIndex === 0 || isLocked}
              onClick={() => goToQuestion(currentIndex - 1, questions[currentIndex - 1].id)}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              disabled={isLocked}
              onClick={() => toggleReview(currentQuestion.id)}
            >
              {markedForReview[currentQuestion.id] ? 'Unmark review' : 'Mark for review'}
            </Button>
            {currentIndex === questions.length - 1 ? (
              <Button disabled={isLocked} onClick={() => setIsConfirmOpen(true)}>
                Submit
              </Button>
            ) : (
              <Button
                disabled={isLocked}
                onClick={() => goToQuestion(currentIndex + 1, questions[currentIndex + 1].id)}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink-900">Question palette</h3>
              <span className="text-xs text-ink-500">
                {answeredCount}/{questions.length} answered
              </span>
            </div>
            <div className="mt-4">
              <QuestionPalette
                questions={questions}
                currentIndex={currentIndex}
                answers={answers}
                visited={visited}
                markedForReview={markedForReview}
                onNavigate={(index) => goToQuestion(index, questions[index].id)}
                disabled={isLocked}
              />
            </div>

            <div className="mt-5 flex flex-col gap-2 text-xs text-ink-600">
              <LegendItem swatchClass="bg-emerald-100 border-emerald-300" label="Answered" />
              <LegendItem swatchClass="bg-red-50 border-red-200" label="Not answered" />
              <LegendItem swatchClass="bg-brand-600 border-brand-600" label="Current" />
              <LegendItem swatchClass="bg-violet-100 border-violet-300" label="Marked for review" />
            </div>

            <Button
              className="mt-6 w-full"
              disabled={isLocked}
              onClick={() => setIsConfirmOpen(true)}
            >
              Submit test
            </Button>
            {submitError && <p className="mt-2 text-xs text-red-600">{submitError}</p>}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        title="Submit assessment?"
        onClose={() => !isSubmitting && setIsConfirmOpen(false)}
      >
        <p>
          You have answered {answeredCount} out of {questions.length} questions. Once submitted, you
          cannot make further changes.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            Confirm submit
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function LegendItem({ swatchClass, label }: { swatchClass: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded border ${swatchClass}`} />
      {label}
    </div>
  )
}
