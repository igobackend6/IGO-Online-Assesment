import { Navigate, Outlet } from 'react-router-dom'
import { useCodingAuthStore } from '../store/codingAuthStore'

export function CodingProtectedRoute() {
  const isAuthenticated = useCodingAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/coding/login" replace />
  }

  return <Outlet />
}
