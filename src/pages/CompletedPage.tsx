import { Card } from '../components/ui/Card'

export function CompletedPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-700">
          ✓
        </div>
        <h1 className="mt-4 text-xl font-semibold text-ink-900">Assessment submitted</h1>
        <p className="mt-2 text-sm text-ink-500">
          Thank you for completing the assessment. Your responses have been recorded successfully. You
          may now close this window.
        </p>
      </Card>
    </div>
  )
}
