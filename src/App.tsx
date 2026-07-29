import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { ProtectedRoute } from './layouts/ProtectedRoute'
import { AdminRoute } from './layouts/AdminRoute'
import { AppLayout } from './layouts/AppLayout'
import { CodingProtectedRoute } from './layouts/CodingProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { InstructionsPage } from './pages/InstructionsPage'
import { TestPage } from './pages/TestPage'
import { CompletedPage } from './pages/CompletedPage'
import { AdminPage } from './pages/AdminPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { CodingLoginPage } from './pages/CodingLoginPage'
import { CodingInstructionsPage } from './pages/CodingInstructionsPage'
import { CodingTestPage } from './pages/CodingTestPage'
import { CodingCompletedPage } from './pages/CodingCompletedPage'

function RootRedirect() {
  const user = useAuthStore((state) => state.user)
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  return <Navigate to="/instructions" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/test" element={<TestPage />} />

        <Route element={<AppLayout />}>
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/completed" element={<CompletedPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/coding/login" element={<CodingLoginPage />} />

      <Route element={<CodingProtectedRoute />}>
        <Route path="/coding/test" element={<CodingTestPage />} />

        <Route element={<AppLayout />}>
          <Route path="/coding/instructions" element={<CodingInstructionsPage />} />
          <Route path="/coding/completed" element={<CodingCompletedPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
