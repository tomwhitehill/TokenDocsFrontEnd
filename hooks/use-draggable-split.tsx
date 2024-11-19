import { useState, useEffect, useCallback, RefObject } from 'react'

export function useDraggableSplit(containerRef: RefObject<HTMLElement>, initialSplit = 50, minSplit = 20, maxSplit = 80) {
  const [split, setSplit] = useState(initialSplit)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const container = containerRef.current
        const containerRect = container.getBoundingClientRect()
        const newSplit = ((e.clientX - containerRect.left) / containerRect.width) * 100
        if (newSplit >= minSplit && newSplit <= maxSplit) {
          setSplit(newSplit)
        }
      }
    },
    [isDragging, minSplit, maxSplit, containerRef]
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return { split, handleMouseDown }
}