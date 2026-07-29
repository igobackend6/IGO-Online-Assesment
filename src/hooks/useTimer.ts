import { useEffect, useRef } from 'react'
import { useTestStore } from '../store/testStore'

export function useTimer(onExpire: () => void) {
  const secondsRemaining = useTestStore((state) => state.secondsRemaining)
  const tick = useTestStore((state) => state.tick)
  const submitted = useTestStore((state) => state.submitted)
  const hasExpiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (submitted) return
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick, submitted])

  useEffect(() => {
    if (secondsRemaining <= 0 && !hasExpiredRef.current && !submitted) {
      hasExpiredRef.current = true
      onExpireRef.current()
    }
  }, [secondsRemaining, submitted])

  return secondsRemaining
}
