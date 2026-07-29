import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-ink-200 bg-white shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}
