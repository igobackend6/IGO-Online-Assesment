import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-50 text-center">
      <h1 className="text-2xl font-semibold text-ink-900">Page not found</h1>
      <p className="text-sm text-ink-500">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  )
}
