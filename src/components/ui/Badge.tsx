import type { HTMLAttributes } from 'react'

type Tone = 'neutral' | 'success' | 'warning' | 'brand'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  brand: 'bg-brand-50 text-brand-700',
}

export function Badge({ tone = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
