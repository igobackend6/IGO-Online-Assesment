import type { CodingTestCase, TestCaseRunResult } from '../../types'

interface TestCasesPanelProps {
  visibleTestCases: CodingTestCase[]
  hiddenCount: number
  runResult: TestCaseRunResult | null
}

export function TestCasesPanel({ visibleTestCases, hiddenCount, runResult }: TestCasesPanelProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-ink-900">Visible Test Cases</h3>
      <div className="mt-2 flex flex-col gap-2">
        {visibleTestCases.map((testCase, index) => {
          const status = runResult?.visibleResults[index]
          return (
            <div key={index} className="rounded-lg border border-ink-200 bg-ink-50 p-3 text-xs">
              <div className="flex items-center gap-2 font-medium text-ink-800">
                {status === true && <span className="text-emerald-600">✓</span>}
                {status === false && <span className="text-red-600">✗</span>}
                <span>Test {index + 1}</span>
              </div>
              <div className="mt-1.5 whitespace-pre-wrap font-mono text-ink-600">
                <div>Input: {testCase.input.replace(/\n/g, ' | ')}</div>
                <div>Expected: {testCase.expectedOutput}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 rounded-lg border border-dashed border-ink-300 bg-white p-3 text-xs text-ink-500">
        Hidden Test Cases — {hiddenCount} hidden
      </div>

      {runResult && (
        <div
          className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${
            runResult.passed >= 8 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}
        >
          Passed {runResult.passed} / {runResult.total}
        </div>
      )}
    </div>
  )
}
