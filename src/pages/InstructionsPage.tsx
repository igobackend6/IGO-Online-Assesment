import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTestStore } from '../store/testStore'
import { createStudent } from '../services/studentService'
import { questions } from '../lib/scoring'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import type { StudentFormData } from '../types'

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'MBA',
  'Other',
]

export function InstructionsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setStudentId = useAuthStore((state) => state.setStudentId)
  const startTest = useTestStore((state) => state.startTest)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>()

  async function onSubmit(values: StudentFormData) {
    if (!user) return
    setSubmitError(null)
    try {
      const student = await createStudent(values, user.email)
      setStudentId(student.id)
      startTest(questions[0].id, questions.length)
      navigate('/test')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
      <Card className="p-6 lg:col-span-3">
        <h1 className="text-xl font-semibold text-ink-900">Assessment Instructions</h1>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-600">
          <li>The test contains 40 multiple-choice questions: 20 Aptitude and 20 Coding.</li>
          <li>You will have 40 minutes to complete the entire test.</li>
          <li>A countdown timer is shown at the top-right of the test screen.</li>
          <li>The timer turns red during the last 5 minutes.</li>
          <li>The test auto-submits automatically the instant the timer reaches zero.</li>
          <li>Use the question palette to jump between questions or mark them for review.</li>
          <li>Your answers are saved automatically as you go — do not close or refresh the browser tab.</li>
          <li>Once submitted, you cannot re-attempt the test or edit your answers.</li>
          <li>Ensure a stable internet connection for the duration of the test.</li>
        </ul>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-ink-900">Your details</h2>
        <p className="mt-1 text-sm text-ink-500">Fill this in before starting the test.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4" noValidate>
          <Input
            label="Name"
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name is too short' },
            })}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
          <Input
            label="Phone Number"
            type="tel"
            error={errors.phone?.message}
            {...register('phone', {
              required: 'Phone number is required',
              pattern: { value: /^[0-9+\-\s]{7,15}$/, message: 'Enter a valid phone number' },
            })}
          />
          <Select
            label="Department"
            options={DEPARTMENTS}
            error={errors.department?.message}
            {...register('department', { required: 'Department is required' })}
          />

          {submitError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
            Start Test
          </Button>
        </form>
      </Card>
    </div>
  )
}
