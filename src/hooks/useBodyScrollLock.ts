'use client'

import { useEffect } from 'react'

const LOCK_COUNT_ATTR = 'data-scroll-lock-count'
const LOCK_OVERFLOW_ATTR = 'data-scroll-lock-overflow'

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body } = document
    const currentCount = Number(body.getAttribute(LOCK_COUNT_ATTR) ?? '0')

    if (currentCount === 0) {
      body.setAttribute(LOCK_OVERFLOW_ATTR, body.style.overflow)
      body.style.overflow = 'hidden'
    }

    body.setAttribute(LOCK_COUNT_ATTR, String(currentCount + 1))

    return () => {
      const nextCount = Math.max(Number(body.getAttribute(LOCK_COUNT_ATTR) ?? '1') - 1, 0)

      if (nextCount === 0) {
        body.style.overflow = body.getAttribute(LOCK_OVERFLOW_ATTR) ?? ''
        body.removeAttribute(LOCK_COUNT_ATTR)
        body.removeAttribute(LOCK_OVERFLOW_ATTR)
        return
      }

      body.setAttribute(LOCK_COUNT_ATTR, String(nextCount))
    }
  }, [locked])
}
