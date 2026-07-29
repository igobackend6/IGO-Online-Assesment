import { formatDuration } from '../../lib/time'

interface TimerDisplayProps {
  secondsRemaining: number
}

const CRITICAL_THRESHOLD_SECONDS = 5 * 60

export function TimerDisplay({ secondsRemaining }: TimerDisplayProps) {
  const isCritical = secondsRemaining <= CRITICAL_THRESHOLD_SECONDS

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-lg font-semibold tabular-nums ${
        isCritical
          ? 'border-red-200 bg-red-50 text-red-600'
          : 'border-ink-200 bg-white text-ink-900'
      }`}
    >
      {formatDuration(secondsRemaining)}
    </div>
  )
}
