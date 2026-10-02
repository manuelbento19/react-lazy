import React from 'react'
import { useLazy } from '../hooks'
import { UseLazyProps } from '../types'

type LazyComponentProps = UseLazyProps & {
    children: React.ReactNode
    fallback?: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export function LazyComponent({
  children,
  fallback = null,
  className,
  style,
  root,
  rootMargin,
  threshold,
  triggerOnce
}: LazyComponentProps) {
    const { ref, visible } = useLazy<HTMLDivElement>({ root, rootMargin, threshold, triggerOnce })

    return (
        <div ref={ref} className={className} style={style}>
            {visible ? children : fallback}
        </div>
    )
}
