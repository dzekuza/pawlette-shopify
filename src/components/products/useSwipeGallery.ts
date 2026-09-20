import { useRef, type Dispatch, type SetStateAction } from 'react'

/** Pointer-swipe handlers for the mobile gallery sliders (>40px horizontal drag changes slide). */
export function useSwipeGallery() {
  const startX = useRef<number | null>(null)

  const handleSwipeStart = (clientX: number) => {
    startX.current = clientX
  }
  const handleSwipeEnd = (clientX: number, length: number, setIndex: Dispatch<SetStateAction<number>>) => {
    if (startX.current === null) return
    const dx = clientX - startX.current
    startX.current = null
    if (dx < -40) setIndex(s => Math.min(s + 1, length - 1))
    else if (dx > 40) setIndex(s => Math.max(s - 1, 0))
  }
  const clearSwipe = () => {
    startX.current = null
  }

  return { handleSwipeStart, handleSwipeEnd, clearSwipe }
}
