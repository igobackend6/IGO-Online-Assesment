import { useEffect, useRef } from 'react'
import { useCodingTestStore } from '../store/codingTestStore'

export function useCodingTimer(onExpire: () => void) {
  const secondsRemaining = useCodingTestStore((state) => state.secondsRemaining)
  const tick = useCodingTestStore((state) => state.tick)
  const roundSubmitted = useCodingTestStore((state) => state.roundSubmitted)
  const hasExpiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (roundSubmitted) return
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick, roundSubmitted])

  useEffect(() => {
    if (secondsRemaining <= 0 && !hasExpiredRef.current && !roundSubmitted) {
      hasExpiredRef.current = true
      onExpireRef.current()
    }
  }, [secondsRemaining, roundSubmitted])

  return secondsRemaining
}
