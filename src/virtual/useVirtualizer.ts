import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// `useLayoutEffect` warns when rendering on the server (React 18).
// Fall back to `useEffect` so the virtual namespace stays SSR-safe.
const useIsomorphicLayoutEffect =
    typeof window !== 'undefined' ? useLayoutEffect : useEffect

export type VirtualItem = {
    index: number
    key: number | string
    start: number
    size: number
    end: number
}

export type UseVirtualizerOptions = {
    count: number
    getScrollElement?: () => HTMLElement | null
    scrollElement?: HTMLElement | null
    ref?: { current: HTMLElement | null } | null
    itemSize?: number
    overscan?: number
    horizontal?: boolean
    paddingStart?: number
    paddingEnd?: number
}

export type ScrollToIndexOptions = {
    align?: 'start' | 'center' | 'end' | 'auto'
    behavior?: ScrollBehavior
}

export function useVirtualizer({
    count,
    getScrollElement,
    scrollElement = null,
    ref = null,
    itemSize = 40,
    overscan = 2,
    horizontal = false,
    paddingStart = 0,
    paddingEnd = 0
}: UseVirtualizerOptions) {
    const [scrollOffset, setScrollOffset] = useState(0)
    const [viewportSize, setViewportSize] = useState(0)
    const resizeObserverRef = useRef<ResizeObserver | null>(null)
    const scrollElementRef = useRef<HTMLElement | null>(null)

    const range = useMemo(() => {
        if (viewportSize === 0 || count === 0) {
            return { start: 0, end: 0 }
        }

        const start = Math.max(0, Math.floor((scrollOffset - paddingStart) / itemSize) - overscan)
        let end = start + Math.ceil(viewportSize / itemSize) + overscan * 2
        if (end > count) end = count

        return { start, end }
    }, [viewportSize, count, scrollOffset, paddingStart, overscan, itemSize])

    const virtualItems = useMemo(() => {
        const items: VirtualItem[] = []
        for (let i = range.start; i < range.end; i++) {
            const start = paddingStart + i * itemSize
            items.push({
                index: i,
                key: i,
                start,
                size: itemSize,
                end: start + itemSize
            })
        }
        return items
    }, [range, itemSize, paddingStart])

    const totalSize = useMemo(
        () => (count === 0 ? paddingStart + paddingEnd : paddingStart + count * itemSize + paddingEnd),
        [count, itemSize, paddingStart, paddingEnd]
    )

    useIsomorphicLayoutEffect(() => {
        const el = getScrollElement?.() || scrollElement || ref?.current
        if (!el) return

        scrollElementRef.current = el

        const handleScroll = () => {
            setScrollOffset(horizontal ? el.scrollLeft : el.scrollTop)
        }

        const handleResize = () => {
            setViewportSize(horizontal ? el.clientWidth : el.clientHeight)
        }

        handleScroll()
        handleResize()

        el.addEventListener('scroll', handleScroll, { passive: true })

        // Mirror the core hooks: environments without ResizeObserver (older
        // browsers, jsdom in consumer test suites) fall back to a single
        // measurement instead of throwing while mounting.
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserverRef.current = new ResizeObserver(handleResize)
            resizeObserverRef.current.observe(el)
        }

        return () => {
            el.removeEventListener('scroll', handleScroll)
            resizeObserverRef.current?.disconnect()
        }
    }, [getScrollElement, scrollElement, ref, horizontal])

    const scrollToIndex = useCallback(
        (index: number, options: ScrollToIndexOptions = {}) => {
            const el = scrollElementRef.current
            if (!el) return

            const offset = paddingStart + index * itemSize
            const align = options.align || 'start'

            let target = offset
            if (align === 'end') target = offset - viewportSize + itemSize
            else if (align === 'center') target = offset - viewportSize / 2 + itemSize / 2

            if (horizontal) el.scrollTo({ left: target, behavior: options.behavior })
            else el.scrollTo({ top: target, behavior: options.behavior })
        },
        [itemSize, paddingStart, horizontal, viewportSize]
    )

    return {
        getVirtualItems: () => virtualItems,
        getTotalSize: () => totalSize,
        scrollToIndex
    }
}
