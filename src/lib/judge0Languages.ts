import type { CodingLanguage } from '../types'

export interface Judge0LanguageConfig {
  label: string
  languageId: number
  monacoLanguage: string
}

// Language IDs confirmed live against the public Judge0 CE demo instance
// (https://ce.judge0.com/languages) — Piston's public API was retired
// (whitelist-only as of 2026-02-15), so this project uses Judge0 CE instead.
// Only these 3 languages are supported for Round 2, per project decision.
export const JUDGE0_LANGUAGES: Record<CodingLanguage, Judge0LanguageConfig> = {
  java: {
    label: 'Java',
    languageId: 91, // Java (JDK 17.0.6)
    monacoLanguage: 'java',
  },
  python: {
    label: 'Python',
    languageId: 92, // Python (3.11.2)
    monacoLanguage: 'python',
  },
  c: {
    label: 'C',
    languageId: 50, // C (GCC 9.2.0)
    monacoLanguage: 'c',
  },
}

export const CODING_LANGUAGE_ORDER: CodingLanguage[] = ['java', 'python', 'c']

export const DEFAULT_CODING_LANGUAGE: CodingLanguage = 'java'
