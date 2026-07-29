import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useCodingAuthStore } from '../store/codingAuthStore'
import { useCodingTestStore, CODING_DURATION_SECONDS } from '../store/codingTestStore'
import { useCodingTimer } from '../hooks/useCodingTimer'
import { useTabSwitchDetection } from '../hooks/useTabSwitchDetection'
import { codingQuestions } from '../data/codingQuestions'
import { runTestCases } from '../services/judge0Service'
import { createCodingSubmission } from '../services/codingSubmissionService'
import { formatDuration } from '../lib/time'
import { ProblemPanel } from '../components/coding/ProblemPanel'
import { SubmissionsTab } from '../components/coding/SubmissionsTab'
import { CodeEditorPanel } from '../components/coding/CodeEditorPanel'
import { TabSwitchWarningModal } from '../components/coding/TabSwitchWarningModal'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import type { CodingLanguage, TestCaseRunResult } from '../types'

type LeftTab = 'description' | 'submissions'
type ConsoleTab = 'console' | 'result'

export function CodingTestPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const codingStudentId = useCodingAuthStore((state) => state.codingStudentId)

  const startedAt = useCodingTestStore((state) => state.startedAt)
  const currentQuestionIndex = useCodingTestStore((state) => state.currentQuestionIndex)
  const progress = useCodingTestStore((state) => state.progress)
  const violationCount = useCodingTestStore((state) => state.violationCount)
  const showViolationWarning = useCodingTestStore((state) => state.showViolationWarning)
  const roundSubmitted = useCodingTestStore((state) => state.roundSubmitted)
  const setCurrentQuestionIndex = useCodingTestStore((state) => state.setCurrentQuestionIndex)
  const setLanguage = useCodingTestStore((state) => state.setLanguage)
  const setCode = useCodingTestStore((state) => state.setCode)
  const markQuestionSubmitted = useCodingTestStore((state) => state.markQuestionSubmitted)
  const registerViolation = useCodingTestStore((state) => state.registerViolation)
  const dismissViolationWarning = useCodingTestStore((state) => state.dismissViolationWarning)
  const markRoundSubmitted = useCodingTestStore((state) => state.markRoundSubmitted)

  const [leftTab, setLeftTab] = useState<LeftTab>('description')
  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('console')
  const [runResults, setRunResults] = useState<Record<number, TestCaseRunResult | null>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false)
  const [isForceSubmitting, setIsForceSubmitting] = useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const currentQuestion = codingQuestions[currentQuestionIndex]
  const currentProgress = progress[currentQuestion?.id]

  const forceSubmitAllRemaining = useCallback(
    async (finalViolationCount: number) => {
      if (!codingStudentId) return
      setIsForceSubmitting(true)
      try {
        for (const question of codingQuestions) {
          const qProgress = useCodingTestStore.getState().progress[question.id]
          if (!qProgress || qProgress.submitted) continue
          const code = qProgress.code[qProgress.language] ?? question.starterCode[qProgress.language]
          const result = await runTestCases(question, qProgress.language, code)
          const startTimestamp = useCodingTestStore.getState().startedAt
          const timeTaken = startTimestamp
            ? Math.round((Date.now() - startTimestamp) / 1000)
            : CODING_DURATION_SECONDS
          await createCodingSubmission(
            codingStudentId,
            question.id,
            qProgress.language,
            code,
            result.passed,
            result.total,
            Math.min(timeTaken, CODING_DURATION_SECONDS),
            finalViolationCount,
          )
          markQuestionSubmitted(question.id)
        }
      } finally {
        markRoundSubmitted()
        navigate('/coding/completed', { replace: true })
      }
    },
    [codingStudentId, markQuestionSubmitted, markRoundSubmitted, navigate],
  )

  const handleTimerExpire = useCallback(() => {
    void forceSubmitAllRemaining(violationCount)
  }, [forceSubmitAllRemaining, violationCount])

  const secondsRemaining = useCodingTimer(handleTimerExpire)

  const handleViolation = useCallback(() => {
    const count = registerViolation()
    if (count >= 2) {
      void forceSubmitAllRemaining(count)
    }
  }, [registerViolation, forceSubmitAllRemaining])

  useTabSwitchDetection(handleViolation, !roundSubmitted && !isForceSubmitting)

  useEffect(() => {
    if (!codingStudentId || startedAt === null) {
      navigate('/coding/instructions', { replace: true })
      return
    }
    if (roundSubmitted) {
      navigate('/coding/completed', { replace: true })
      return
    }
    // Safety net: if a 2nd violation was recorded but the resulting
    // force-submit never completed (e.g. the tab was mid-navigation when it
    // fired), retry it now instead of leaving the round in limbo.
    if (violationCount >= 2 && !isForceSubmitting) {
      void forceSubmitAllRemaining(violationCount)
    }
  }, [codingStudentId, startedAt, roundSubmitted, violationCount, isForceSubmitting, forceSubmitAllRemaining, navigate])

  if (!currentQuestion || !currentProgress) return null

  const currentLanguage = currentProgress.language
  const currentCode = currentProgress.code[currentLanguage] ?? currentQuestion.starterCode[currentLanguage]
  const currentRunResult = runResults[currentQuestion.id] ?? null
  const isLocked = roundSubmitted || isForceSubmitting || currentProgress.submitted

  async function handleRunCode() {
    setIsRunning(true)
    setSubmitError(null)
    try {
      const result = await runTestCases(currentQuestion, currentLanguage, currentCode)
      setRunResults((prev) => ({ ...prev, [currentQuestion.id]: result }))
      setConsoleTab('result')
    } catch (error) {
      setRunResults((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          passed: 0,
          total: currentQuestion.testCases.length,
          visibleResults: [],
          stdout: '',
          stderr: error instanceof Error ? error.message : 'Execution failed.',
        },
      }))
      setConsoleTab('console')
    } finally {
      setIsRunning(false)
    }
  }

  async function handleSubmitQuestion() {
    if (!codingStudentId || startedAt === null) return
    setIsSubmittingQuestion(true)
    setSubmitError(null)
    try {
      const result = await runTestCases(currentQuestion, currentLanguage, currentCode)
      setRunResults((prev) => ({ ...prev, [currentQuestion.id]: result }))
      const timeTaken = Math.round((Date.now() - startedAt) / 1000)
      await createCodingSubmission(
        codingStudentId,
        currentQuestion.id,
        currentLanguage,
        currentCode,
        result.passed,
        result.total,
        Math.min(timeTaken, CODING_DURATION_SECONDS),
        violationCount,
      )
      markQuestionSubmitted(currentQuestion.id)
      setConsoleTab('result')
      void queryClient.invalidateQueries({
        queryKey: ['coding-submission-history', codingStudentId, currentQuestion.id],
      })

      const allSubmitted = codingQuestions.every((question) => {
        if (question.id === currentQuestion.id) return true
        return Boolean(useCodingTestStore.getState().progress[question.id]?.submitted)
      })
      if (allSubmitted) {
        markRoundSubmitted()
        navigate('/coding/completed', { replace: true })
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit. Please try again.')
    } finally {
      setIsSubmittingQuestion(false)
    }
  }

  function handleLanguageChange(language: CodingLanguage) {
    setLanguage(currentQuestion.id, language, currentQuestion.starterCode[language])
  }

  function handleExitConfirmed() {
    markRoundSubmitted()
    navigate('/coding/completed', { replace: true })
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-ink-900">Round 2 — Live Coding</span>
          <span
            className={`rounded-lg border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums ${
              secondsRemaining <= 300
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-ink-200 bg-ink-50 text-ink-900'
            }`}
            role="timer"
          >
            {formatDuration(secondsRemaining)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {codingQuestions.map((question, index) => {
            const isSubmittedQ = Boolean(progress[question.id]?.submitted)
            const isActive = index === currentQuestionIndex
            return (
              <button
                key={question.id}
                type="button"
                onClick={() => setCurrentQuestionIndex(index)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : isSubmittedQ
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-ink-200 bg-white text-ink-600'
                }`}
              >
                Question {index + 1}
              </button>
            )
          })}
        </div>

        <Button variant="secondary" onClick={() => setIsExitConfirmOpen(true)} className="text-xs">
          Exit Session
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        <div className="flex min-h-0 w-1/2 flex-col border-r border-ink-200">
          <div className="flex border-b border-ink-200 px-2">
            <button
              type="button"
              onClick={() => setLeftTab('description')}
              className={`px-3 py-2.5 text-sm font-medium ${
                leftTab === 'description' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-ink-500'
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('submissions')}
              className={`px-3 py-2.5 text-sm font-medium ${
                leftTab === 'submissions' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-ink-500'
              }`}
            >
              Submissions
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {leftTab === 'description' ? (
              <ProblemPanel question={currentQuestion} runResult={currentRunResult} />
            ) : (
              <SubmissionsTab codingStudentId={codingStudentId ?? ''} questionId={currentQuestion.id} />
            )}
          </div>
        </div>

        <div className="w-1/2">
          <CodeEditorPanel
            language={currentLanguage}
            code={currentCode}
            onLanguageChange={handleLanguageChange}
            onCodeChange={(code) => setCode(currentQuestion.id, currentLanguage, code)}
            onRun={handleRunCode}
            onSubmit={handleSubmitQuestion}
            isRunning={isRunning}
            isSubmitting={isSubmittingQuestion}
            isLocked={isLocked}
            consoleTab={consoleTab}
            onConsoleTabChange={setConsoleTab}
            runResult={currentRunResult}
            alreadySubmitted={currentProgress.submitted}
          />
        </div>
      </div>

      {submitError && (
        <div className="border-t border-red-200 bg-red-50 px-5 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <TabSwitchWarningModal isOpen={showViolationWarning} onContinue={dismissViolationWarning} />

      <Modal
        isOpen={isExitConfirmOpen}
        title="Exit this session?"
        onClose={() => setIsExitConfirmOpen(false)}
      >
        <p>
          Any question you have not submitted will not be scored. This cannot be undone once you
          exit.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsExitConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleExitConfirmed}>
            Exit session
          </Button>
        </div>
      </Modal>

      {isForceSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50">
          <div className="rounded-2xl bg-white px-6 py-5 text-sm font-medium text-ink-800 shadow-xl">
            Submitting your assessment…
          </div>
        </div>
      )}
    </div>
  )
}
