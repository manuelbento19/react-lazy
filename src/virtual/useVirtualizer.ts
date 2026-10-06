import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

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
    estimateSize?: (index: number) => number
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
    estimateSize = () => 40,
    itemSize,
    overscan = 2,
    horizontal = false,
    paddingStart = 0,
    paddingEnd = 0
}: UseVirtualizerOptions) {
    const [scrollOffset, setScrollOffset] = useState(0)
    const [viewportSize, setViewportSize] = useState(0)
    const resizeObserverRef = useRef<ResizeObserver | null>(null)
    const scrollElementRef = useRef<HTMLElement | null>(null)

    const getSize = useCallback(
        (index: number) => {
            if (typeof itemSize === 'number') return itemSize
            return estimateSize(index)
        },
        [estimateSize, itemSize]
    )

    const range = useMemo(() => {
        if (viewportSize === 0 || count === 0) {
            return { start: 0, end: 0 }
        }

        const sizePerItem = itemSize || estimateSize(0) || 40
        const start = Math.max(0, Math.floor((scrollOffset - paddingStart) / sizePerItem) - overscan)
        let end = start + Math.ceil(viewportSize / sizePerItem) + overscan * 2
        if (end > count) end = count

        return { start, end }
    }, [viewportSize, count, scrollOffset, paddingStart, overscan, itemSize, estimateSize])

    const virtualItems = useMemo(() => {
        const items: VirtualItem[] = []
        const isFixed = typeof itemSize === 'number'
        for (let i = range.start; i < range.end; i++) {
            const size = isFixed ? itemSize : getSize(i)
            const start = isFixed ? paddingStart + i * itemSize : paddingStart + i * size
            items.push({
                index: i,
                key: i,
                start,
                size,
                end: start + size
            })
        }
        return items
    }, [range, getSize, itemSize, paddingStart])

    const totalSize = useMemo(() => {
        if (count === 0) return paddingStart + paddingEnd
        if (typeof itemSize === 'number') {
            return paddingStart + count * itemSize + paddingEnd
        }
        let sum = 0
        for (let i = 0; i < count; i++) {
            sum += getSize(i)
        }
        return paddingStart + sum + paddingEnd
    }, [count, itemSize, getSize, paddingStart, paddingEnd])

    useLayoutEffect(() => {
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
        resizeObserverRef.current = new ResizeObserver(handleResize)
        resizeObserverRef.current.observe(el)

        return () => {
            el.removeEventListener('scroll', handleScroll)
            resizeObserverRef.current?.disconnect()
        }
    }, [getScrollElement, scrollElement, ref, horizontal])

    const scrollToIndex = useCallback(
        (index: number, options: ScrollToIndexOptions = {}) => {
            const el = scrollElementRef.current
            if (!el) return

            const isFixed = typeof itemSize === 'number'
            const size = isFixed ? itemSize : getSize(index)
            const offset = isFixed ? paddingStart + index * itemSize : paddingStart + index * size
            const align = options.align || 'start'

            let target = offset
            if (align === 'end') target = offset - viewportSize + size
            else if (align === 'center') target = offset - viewportSize / 2 + size / 2

            if (horizontal) el.scrollTo({ left: target, behavior: options.behavior })
            else el.scrollTo({ top: target, behavior: options.behavior })
        },
        [itemSize, getSize, paddingStart, horizontal, viewportSize]
    )

    return {
        getVirtualItems: () => virtualItems,
        getTotalSize: () => totalSize,
        scrollToIndex
    }
}
