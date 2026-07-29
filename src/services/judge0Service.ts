import { JUDGE0_LANGUAGES } from '../lib/judge0Languages'
import type { CodingLanguage, CodingQuestion, TestCaseRunResult } from '../types'

const JUDGE0_SUBMISSION_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true'

// This is Judge0's own public CE demo instance (free, no signup) — shared by
// everyone trying Judge0, not a dedicated production deployment. Concurrency
// is deliberately kept low to avoid tripping its rate limiting mid-assessment.
const MAX_CONCURRENT_REQUESTS = 2
const ACCEPTED_STATUS_ID = 3
const VISIBLE_TEST_CASE_COUNT = 3

interface Judge0Status {
  id: number
  description: string
}

interface Judge0SubmissionResponse {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  status: Judge0Status
  time: string | null
  memory: number | null
}

export interface ExecuteCodeResult {
  stdout: string
  stderr: string
  compileOutput: string | null
  statusDescription: string
  succeeded: boolean
}

export async function executeCode(
  language: CodingLanguage,
  code: string,
  stdin: string,
): Promise<ExecuteCodeResult> {
  const config = JUDGE0_LANGUAGES[language]

  const response = await fetch(JUDGE0_SUBMISSION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: code,
      language_id: config.languageId,
      stdin,
    }),
  })

  if (!response.ok) {
    throw new Error(`Code execution service returned ${response.status}`)
  }

  const data = (await response.json()) as Judge0SubmissionResponse

  return {
    stdout: data.stdout ?? '',
    stderr: data.stderr ?? '',
    compileOutput: data.compile_output,
    statusDescription: data.status.description,
    succeeded: data.status.id === ACCEPTED_STATUS_ID,
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await mapper(items[currentIndex], currentIndex)
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker())
  await Promise.all(workers)
  return results
}

export async function runTestCases(
  question: CodingQuestion,
  language: CodingLanguage,
  code: string,
): Promise<TestCaseRunResult> {
  let firstStdout = ''
  let firstStderr = ''

  const outcomes = await mapWithConcurrency(
    question.testCases,
    MAX_CONCURRENT_REQUESTS,
    async (testCase, index) => {
      const result = await executeCode(language, code, testCase.input)
      if (index === 0) {
        firstStdout = result.compileOutput || result.stdout
        firstStderr = result.stderr
      }
      if (!result.succeeded) return false
      return result.stdout.trim() === testCase.expectedOutput.trim()
    },
  )

  const passed = outcomes.filter(Boolean).length

  return {
    passed,
    total: question.testCases.length,
    visibleResults: outcomes.slice(0, VISIBLE_TEST_CASE_COUNT),
    stdout: firstStdout,
    stderr: firstStderr,
  }
}
