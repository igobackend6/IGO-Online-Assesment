export type UserRole = 'admin' | 'candidate'

export interface AuthUser {
  email: string
  role: UserRole
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  department: string
  login_email: string
  created_at: string
}

export interface StudentFormData {
  name: string
  email: string
  phone: string
  department: string
}

export type QuestionCategory = 'Aptitude' | 'Coding'

export interface Question {
  id: number
  category: QuestionCategory
  question: string
  options: string[]
  correctAnswer: number
}

export type AnswerMap = Record<number, number>

export interface Submission {
  id: string
  student_id: string
  answers_json: AnswerMap
  submitted_at: string
  time_taken: number
  score: number
  total_questions: number
  percentage: number
}

export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'review' | 'answered-review'

export interface SubmissionWithStudent extends Submission {
  student: Student | null
}

// ---------------------------------------------------------------------------
// Round 2: Live Coding Assessment
// ---------------------------------------------------------------------------

export type CodingLanguage = 'java' | 'python' | 'c'

export type CodingQuestionCategory = 'Data Structures' | 'Algorithms'

export type CodingDifficulty = 'Medium' | 'Hard'

export interface CodingTestCase {
  input: string
  expectedOutput: string
}

export interface CodingExample {
  input: string
  output: string
  explanation?: string
}

export interface CodingQuestion {
  id: number
  title: string
  category: CodingQuestionCategory
  difficulty: CodingDifficulty
  description: string
  constraints: string[]
  examples: CodingExample[]
  testCases: CodingTestCase[]
  starterCode: Record<CodingLanguage, string>
}

export interface CodingStudent {
  id: string
  name: string
  email: string
  phone: string
  department: string
  login_email: string
  registered_at: string
}

export interface CodingStudentFormData {
  name: string
  email: string
  phone: string
  department: string
}

export interface CodingSubmission {
  id: string
  coding_student_id: string
  question_id: number
  language: CodingLanguage
  code: string
  passed_test_cases: number
  total_test_cases: number
  percentage: number
  time_taken: number
  violation_count: number
  submitted_at: string
}

export interface CodingSubmissionWithStudent extends CodingSubmission {
  coding_student: CodingStudent | null
}

export interface TestCaseRunResult {
  passed: number
  total: number
  visibleResults: boolean[]
  stdout: string
  stderr: string
}
