import type { Question } from '../../types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  selectedOption?: number
  onSelect: (optionIndex: number) => void
  disabled?: boolean
}

export function QuestionCard({
  question,
  questionNumber,
  selectedOption,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
          {question.category}
        </span>
        <span className="text-xs font-medium text-ink-400">Question {questionNumber} of 40</span>
      </div>
      <h2 className="mt-3 text-lg font-medium leading-relaxed text-ink-900">{question.question}</h2>
      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index
          return (
            <label
              key={index}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              } ${
                isSelected
                  ? 'border-brand-400 bg-brand-50 text-brand-900'
                  : 'border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                className="h-4 w-4 accent-brand-600"
                checked={isSelected}
                disabled={disabled}
                onChange={() => onSelect(index)}
              />
              {option}
            </label>
          )
        })}
      </div>
    </div>
  )
}
