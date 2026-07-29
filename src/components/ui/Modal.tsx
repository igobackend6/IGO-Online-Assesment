import type { MouseEvent, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null

  function stopPropagation(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={stopPropagation}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
        <div className="mt-3 text-sm text-ink-600">{children}</div>
      </div>
    </div>
  )
}
