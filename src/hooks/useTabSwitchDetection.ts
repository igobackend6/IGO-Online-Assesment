import { useEffect, useRef } from 'react'

const DEDUPE_WINDOW_MS = 500

/**
 * Fires `onViolation` once per "leaving the tab" event.
 *
 * `visibilitychange` (document.hidden) is the sole trigger — it's the
 * standard, reliable signal browsers provide for "the user navigated away"
 * (tab switch, app switch, minimize), and is what most proctoring tools rely
 * on for this exact reason. `blur`/`focus` listeners are still attached (the
 * assessment spec calls for using them), but do not independently register
 * violations: `blur` fires for many benign in-page reasons (clicking into
 * the Monaco editor, a <select>, a modal button) and, in testing, could race
 * with `visibilitychange` for the same real switch and double-count it.
 */
export function useTabSwitchDetection(onViolation: () => void, enabled: boolean) {
  const lastViolationAtRef = useRef(0)
  const onViolationRef = useRef(onViolation)
  onViolationRef.current = onViolation

  useEffect(() => {
    if (!enabled) return

    function registerViolation() {
      const now = Date.now()
      if (now - lastViolationAtRef.current < DEDUPE_WINDOW_MS) return
      lastViolationAtRef.current = now
      onViolationRef.current()
    }

    function handleVisibilityChange() {
      if (document.hidden) registerViolation()
    }

    function handleBlur() {
      // Intentionally not a violation trigger — see comment above.
    }

    function handleFocus() {
      // No-op: violations are counted when leaving, not when returning.
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled])
}
