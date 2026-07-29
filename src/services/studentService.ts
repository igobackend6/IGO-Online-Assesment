import { supabase } from '../lib/supabaseClient'
import type { Student, StudentFormData } from '../types'

export async function createStudent(data: StudentFormData, loginEmail: string): Promise<Student> {
  const { data: row, error } = await supabase
    .from('students')
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
  return row as Student
}

export async function fetchStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Student[]
}
