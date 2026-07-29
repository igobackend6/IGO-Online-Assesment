export function validateCodingCredentials(email: string, password: string): boolean {
  const configuredEmail = import.meta.env.VITE_CODING_AUTH_EMAIL
  const configuredPassword = import.meta.env.VITE_CODING_AUTH_PASSWORD

  if (!configuredEmail || !configuredPassword) return false

  return (
    email.trim().toLowerCase() === configuredEmail.trim().toLowerCase() &&
    password === configuredPassword
  )
}
