import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', id, ...props },
  ref,
) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`rounded-lg border px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:ring-2 focus:ring-brand-200 ${
          error ? 'border-red-400 focus:border-red-400' : 'border-ink-200 focus:border-brand-400'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
})
