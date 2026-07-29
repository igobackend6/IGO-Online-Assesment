import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCodingAuthStore } from '../store/codingAuthStore'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

interface CodingLoginFormValues {
  email: string
  password: string
}

export function CodingLoginPage() {
  const login = useCodingAuthStore((state) => state.login)
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodingLoginFormValues>()

  async function onSubmit(values: CodingLoginFormValues) {
    setAuthError(null)
    const success = login(values.email, values.password)
    if (!success) {
      setAuthError('Invalid email or password.')
      return
    }
    navigate('/coding/instructions', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-lg font-bold text-white">
            {'</>'}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink-900">Round 2 — Coding Assessment</h1>
            <p className="mt-1 text-sm text-ink-500">
              Only candidates who qualified Round 1 (score 75% or higher) can proceed past
              registration.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          {authError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  )
}
