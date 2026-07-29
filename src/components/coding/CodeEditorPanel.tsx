import Editor from '@monaco-editor/react'
import { CODING_LANGUAGE_ORDER, JUDGE0_LANGUAGES } from '../../lib/judge0Languages'
import { Button } from '../ui/Button'
import type { CodingLanguage, TestCaseRunResult } from '../../types'

type ConsoleTab = 'console' | 'result'

interface CodeEditorPanelProps {
  language: CodingLanguage
  code: string
  onLanguageChange: (language: CodingLanguage) => void
  onCodeChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  isRunning: boolean
  isSubmitting: boolean
  isLocked: boolean
  consoleTab: ConsoleTab
  onConsoleTabChange: (tab: ConsoleTab) => void
  runResult: TestCaseRunResult | null
  alreadySubmitted: boolean
}

export function CodeEditorPanel({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  isLocked,
  consoleTab,
  onConsoleTabChange,
  runResult,
  alreadySubmitted,
}: CodeEditorPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink-200 px-4 py-2">
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value as CodingLanguage)}
          disabled={isLocked}
          className="rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 disabled:opacity-60"
        >
          {CODING_LANGUAGE_ORDER.map((lang) => (
            <option key={lang} value={lang}>
              {JUDGE0_LANGUAGES[lang].label}
            </option>
          ))}
        </select>
        {alreadySubmitted && <span className="text-xs font-medium text-emerald-600">Submitted</span>}
      </div>

      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={JUDGE0_LANGUAGES[language].monacoLanguage}
          value={code}
          onChange={(value) => onCodeChange(value ?? '')}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
            readOnly: isLocked,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div className="border-t border-ink-200">
        <div className="flex items-center border-b border-ink-100 px-4">
          <button
            type="button"
            onClick={() => onConsoleTabChange('console')}
            className={`px-3 py-2 text-xs font-medium ${
              consoleTab === 'console' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-ink-500'
            }`}
          >
            Console
          </button>
          <button
            type="button"
            onClick={() => onConsoleTabChange('result')}
            className={`px-3 py-2 text-xs font-medium ${
              consoleTab === 'result' ? 'border-b-2 border-brand-600 text-brand-700' : 'text-ink-500'
            }`}
          >
            Test Result
          </button>
        </div>

        <div className="h-28 overflow-y-auto px-4 py-2 font-mono text-xs text-ink-700">
          {consoleTab === 'console' ? (
            runResult ? (
              <>
                {runResult.stdout && <pre className="whitespace-pre-wrap">{runResult.stdout}</pre>}
                {runResult.stderr && (
                  <pre className="whitespace-pre-wrap text-red-600">{runResult.stderr}</pre>
                )}
                {!runResult.stdout && !runResult.stderr && (
                  <span className="text-ink-400">No output.</span>
                )}
              </>
            ) : (
              <span className="text-ink-400">Run your code to see output here.</span>
            )
          ) : runResult ? (
            <span
              className={
                runResult.passed >= 8 ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'
              }
            >
              Passed {runResult.passed} / {runResult.total}
            </span>
          ) : (
            <span className="text-ink-400">Run or submit your code to see results here.</span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-100 px-4 py-3">
          <Button variant="secondary" onClick={onRun} isLoading={isRunning} disabled={isLocked || isSubmitting}>
            Run Code
          </Button>
          <Button onClick={onSubmit} isLoading={isSubmitting} disabled={isLocked || isRunning}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  )
}
