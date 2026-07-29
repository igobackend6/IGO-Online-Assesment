import { supabase } from '../lib/supabaseClient'
import type { CodingLanguage, CodingSubmission, CodingSubmissionWithStudent } from '../types'

export const CODING_PASS_THRESHOLD = 8

export async function createCodingSubmission(
  codingStudentId: string,
  questionId: number,
  language: CodingLanguage,
  code: string,
  passedTestCases: number,
  totalTestCases: number,
  timeTaken: number,
  violationCount: number,
): Promise<CodingSubmission> {
  const percentage =
    totalTestCases === 0 ? 0 : Math.round((passedTestCases / totalTestCases) * 10000) / 100

  const { data, error } = await supabase
    .from('coding_submissions')
    .insert({
      coding_student_id: codingStudentId,
      question_id: questionId,
      language,
      code,
      passed_test_cases: passedTestCases,
      total_test_cases: totalTestCases,
      percentage,
      time_taken: timeTaken,
      violation_count: violationCount,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as CodingSubmission
}

export async function fetchSubmissionHistory(
  codingStudentId: string,
  questionId: number,
): Promise<CodingSubmission[]> {
  const { data, error } = await supabase
    .from('coding_submissions')
    .select('*')
    .eq('coding_student_id', codingStudentId)
    .eq('question_id', questionId)
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as CodingSubmission[]
}

export async function fetchCodingSubmissionsWithStudents(): Promise<CodingSubmissionWithStudent[]> {
  const { data, error } = await supabase
    .from('coding_submissions')
    .select('*, coding_student:coding_students(*)')
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as CodingSubmissionWithStudent[]
}

export async function fetchQualifiedCodingSubmissions(): Promise<CodingSubmissionWithStudent[]> {
  const { data, error } = await supabase
    .from('coding_submissions')
    .select('*, coding_student:coding_students(*)')
    .gte('passed_test_cases', CODING_PASS_THRESHOLD)
    .order('passed_test_cases', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as CodingSubmissionWithStudent[]
}
