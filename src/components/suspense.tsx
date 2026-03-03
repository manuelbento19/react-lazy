import React, { Suspense } from 'react'
import { useLazy } from '../hooks/useLazy'

type LazySuspenseProps = {
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function LazySuspense({
     children,
     fallback = null
 }: LazySuspenseProps) {
    const { ref, visible } = useLazy<HTMLDivElement>({})

    return (
        <div ref={ref}>
            {visible && (
                <Suspense fallback={fallback}>
                    {children}
                </Suspense>
            )}
        </div>
    )
}