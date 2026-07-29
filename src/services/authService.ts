import type { AuthUser, UserRole } from '../types'

interface AuthorizedUser {
  email: string
  password: string
  role: UserRole
}

const authorizedUsers: AuthorizedUser[] = [
  {
    email: import.meta.env.VITE_AUTH_USER_1_EMAIL,
    password: import.meta.env.VITE_AUTH_USER_1_PASSWORD,
    role: import.meta.env.VITE_AUTH_USER_1_ROLE as UserRole,
  },
  {
    email: import.meta.env.VITE_AUTH_USER_2_EMAIL,
    password: import.meta.env.VITE_AUTH_USER_2_PASSWORD,
    role: import.meta.env.VITE_AUTH_USER_2_ROLE as UserRole,
  },
  {
    email: import.meta.env.VITE_AUTH_USER_3_EMAIL,
    password: import.meta.env.VITE_AUTH_USER_3_PASSWORD,
    role: import.meta.env.VITE_AUTH_USER_3_ROLE as UserRole,
  },
  {
    email: import.meta.env.VITE_AUTH_USER_4_EMAIL,
    password: import.meta.env.VITE_AUTH_USER_4_PASSWORD,
    role: import.meta.env.VITE_AUTH_USER_4_ROLE as UserRole,
  },
].filter((candidate) => Boolean(candidate.email && candidate.password && candidate.role))

export function validateCredentials(email: string, password: string): AuthUser | null {
  const normalizedEmail = email.trim().toLowerCase()
  const match = authorizedUsers.find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
  )
  if (!match) return null
  return { email: match.email, role: match.role }
}
