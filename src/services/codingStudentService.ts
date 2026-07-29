import { supabase } from '../lib/supabaseClient'
import { QUALIFYING_PERCENTAGE } from './submissionService'
import type { CodingStudent, CodingStudentFormData } from '../types'

export async function checkRound1Eligibility(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase()

  const { data, error } = await supabase
    .from('students')
    .select('id, submissions!inner(percentage)')
    .ilike('email', normalizedEmail)
    .gte('submissions.percentage', QUALIFYING_PERCENTAGE)
    .limit(1)

  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}

export async function createCodingStudent(
  data: CodingStudentFormData,
  loginEmail: string,
): Promise<CodingStudent> {
  const { data: row, error } = await supabase
    .from('coding_students')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
      login_email: loginEmail,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return row as CodingStudent
}

export async function fetchCodingStudents(): Promise<CodingStudent[]> {
  const { data, error } = await supabase
    .from('coding_students')
    .select('*')
    .order('registered_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as CodingStudent[]
}
