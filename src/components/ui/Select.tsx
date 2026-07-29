import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: string[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className = '', id, ...props },
  ref,
) {
  const selectId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-ink-700">
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        className={`rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:ring-2 focus:ring-brand-200 ${
          error ? 'border-red-400 focus:border-red-400' : 'border-ink-200 focus:border-brand-400'
        } ${className}`}
        {...props}
      >
        <option value="">Select department</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
})
