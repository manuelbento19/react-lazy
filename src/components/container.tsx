import React from 'react'
import {LazyProps, useLazy} from '../hooks/useLazy'

type LazyComponentProps = LazyProps & {
    children: React.ReactNode
    fallback?: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export default function LazyComponent({
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
