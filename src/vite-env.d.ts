/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_AUTH_USER_1_EMAIL: string
  readonly VITE_AUTH_USER_1_PASSWORD: string
  readonly VITE_AUTH_USER_1_ROLE: string
  readonly VITE_AUTH_USER_2_EMAIL: string
  readonly VITE_AUTH_USER_2_PASSWORD: string
  readonly VITE_AUTH_USER_2_ROLE: string
  readonly VITE_AUTH_USER_3_EMAIL: string
  readonly VITE_AUTH_USER_3_PASSWORD: string
  readonly VITE_AUTH_USER_3_ROLE: string
  readonly VITE_AUTH_USER_4_EMAIL: string
  readonly VITE_AUTH_USER_4_PASSWORD: string
  readonly VITE_AUTH_USER_4_ROLE: string
  readonly VITE_CODING_AUTH_EMAIL: string
  readonly VITE_CODING_AUTH_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
