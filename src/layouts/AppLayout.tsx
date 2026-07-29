import { Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTestStore } from '../store/testStore'
import { Button } from '../components/ui/Button'

export function AppLayout() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const resetTest = useTestStore((state) => state.reset)
  const navigate = useNavigate()

  function handleLogout() {
    resetTest()
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              A
            </div>
            <span className="text-base font-semibold text-ink-900">Assess</span>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-500">{user.email}</span>
              <Button variant="secondary" onClick={handleLogout} className="px-3 py-1.5 text-xs">
                Sign out
              </Button>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
