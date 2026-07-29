import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCodingAuthStore } from '../store/codingAuthStore'
import { useCodingTestStore } from '../store/codingTestStore'
import { checkRound1Eligibility, createCodingStudent } from '../services/codingStudentService'
import { codingQuestions } from '../data/codingQuestions'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import type { CodingStudentFormData } from '../types'

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

export function CodingInstructionsPage() {
  const navigate = useNavigate()
  const setCodingStudentId = useCodingAuthStore((state) => state.setCodingStudentId)
  const startRound = useCodingTestStore((state) => state.startRound)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CodingStudentFormData>()

  async function onSubmit(values: CodingStudentFormData) {
    setSubmitError(null)
    try {
      const isEligible = await checkRound1Eligibility(values.email)
      if (!isEligible) {
        setSubmitError(
          'This email is not on record as qualifying Round 1 (score of 75% or higher required). Double-check you entered the same email you registered with in Round 1.',
        )
        return
      }

      const codingStudent = await createCodingStudent(values, 'codelogin@gmail.com')
      setCodingStudentId(codingStudent.id)
      startRound(codingQuestions)
      navigate('/coding/test')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
      <Card className="p-6 lg:col-span-3">
        <h1 className="text-xl font-semibold text-ink-900">Round 2 Instructions</h1>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-600">
          <li>This round contains 2 original coding problems: one Medium (Data Structures), one Hard (Algorithms).</li>
          <li>You have 60 minutes total for both questions, shown as a countdown timer.</li>
          <li>Choose Java, Python, or C from the language dropdown — Java is selected by default.</li>
          <li>Each question shows 3 visible test cases; 7 more are hidden and used for grading.</li>
          <li>Run Code checks your solution against all 10 test cases without saving anything.</li>
          <li>Submit checks your solution and permanently records the attempt (visible in the Submissions tab).</li>
          <li>You pass a question by passing at least 8 of the 10 test cases.</li>
          <li>Switching tabs or windows is monitored. The first switch shows a warning; a second switch immediately auto-submits the entire round.</li>
          <li>Once the round is submitted, you cannot make further changes.</li>
        </ul>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-ink-900">Coding registration</h2>
        <p className="mt-1 text-sm text-ink-500">
          Enter the same email you used in Round 1 — it's used to confirm you qualified.
        </p>

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
            Start Coding Test
          </Button>
        </form>
      </Card>
    </div>
  )
}
