import React, { useRef } from 'react'
import { useLazy } from '../hooks/useLazy'

interface LazyComponentProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export default function LazyComponent({ fallback,children }: LazyComponentProps){
  const elementRef = useRef<HTMLImageElement | null>(null)
  const { visible, isPending } = useLazy({ elementRef })

  return (
    <div style={{width: "100%",height: "100%"}} ref={elementRef}>
      {visible && !isPending ? fallback : children}
    </div>
  )
}
