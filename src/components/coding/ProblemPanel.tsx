import type { CodingQuestion, TestCaseRunResult } from '../../types'
import { Badge } from '../ui/Badge'
import { MarkdownLite } from './MarkdownLite'
import { TestCasesPanel } from './TestCasesPanel'

interface ProblemPanelProps {
  question: CodingQuestion
  runResult: TestCaseRunResult | null
}

export function ProblemPanel({ question, runResult }: ProblemPanelProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold text-ink-900">{question.title}</h2>
        <Badge tone="brand">{question.category}</Badge>
        <Badge tone={question.difficulty === 'Hard' ? 'warning' : 'neutral'}>{question.difficulty}</Badge>
      </div>

      <MarkdownLite text={question.description} />

      <div>
        <h3 className="text-sm font-semibold text-ink-900">Examples</h3>
        <div className="mt-2 flex flex-col gap-3">
          {question.examples.map((example, index) => (
            <div key={index} className="rounded-lg border border-ink-200 bg-ink-50 p-3 text-xs">
              <div className="font-semibold text-ink-700">Example {index + 1}:</div>
              <div className="mt-1 whitespace-pre-wrap font-mono text-ink-600">Input: {example.input}</div>
              <div className="whitespace-pre-wrap font-mono text-ink-600">Output: {example.output}</div>
              {example.explanation && <div className="mt-1 text-ink-500">{example.explanation}</div>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink-900">Constraints</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-ink-600">
          {question.constraints.map((constraint, index) => (
            <li key={index}>
              <code className="font-mono">{constraint}</code>
            </li>
          ))}
        </ul>
      </div>

      <TestCasesPanel
        visibleTestCases={question.testCases.slice(0, 3)}
        hiddenCount={question.testCases.length - 3}
        runResult={runResult}
      />
    </div>
  )
}
