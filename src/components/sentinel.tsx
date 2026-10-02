import React, { forwardRef } from 'react'
import { useLazyCallback } from '../hooks'
import { UseLazyProps } from '../types'

export type LazySentinelProps = UseLazyProps & {
    onVisible: () => void
    as?: React.ElementType
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}

export const LazySentinel = forwardRef<HTMLElement, LazySentinelProps>(
    (
        {
            onVisible,
            root,
            rootMargin,
            threshold,
            triggerOnce = true,
            as: Component = 'div',
            className,
            style,
            children,
            ...rest
        },
        forwardedRef
    ) => {
        const { ref } = useLazyCallback<HTMLElement>({
            onVisible,
            root,
            rootMargin,
            threshold,
            triggerOnce
        })

        return (
            <Component
                ref={(node: HTMLElement | null) => {
                    ;(ref as React.MutableRefObject<HTMLElement | null>).current = node
                    if (typeof forwardedRef === 'function') forwardedRef(node)
                    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
                }}
                className={className}
                style={{
                    height: 0,
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    ...(style || {})
                }}
                aria-hidden
                {...rest}
            >
                {children}
            </Component>
        )
    }
)

LazySentinel.displayName = 'LazySentinel'