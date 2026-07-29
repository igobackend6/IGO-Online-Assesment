import { supabase } from '../lib/supabaseClient'
import type { AnswerMap, Submission, SubmissionWithStudent } from '../types'

export const QUALIFYING_PERCENTAGE = 75

export async function createSubmission(
  studentId: string,
  answers: AnswerMap,
  timeTaken: number,
  score: number,
  totalQuestions: number,
  percentage: number,
): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      student_id: studentId,
      answers_json: answers,
      time_taken: timeTaken,
      score,
      total_questions: totalQuestions,
      percentage,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Submission
}

export async function fetchSubmissionsWithStudents(): Promise<SubmissionWithStudent[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, student:students(*)')
    .order('submitted_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as SubmissionWithStudent[]
}

export async function fetchQualifiedSubmissions(): Promise<SubmissionWithStudent[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, student:students(*)')
    .gte('percentage', QUALIFYING_PERCENTAGE)
    .order('percentage', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as SubmissionWithStudent[]
}
