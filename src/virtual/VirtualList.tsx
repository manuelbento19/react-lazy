import React, { useCallback, useRef } from 'react'
import { useVirtualizer, UseVirtualizerOptions, VirtualItem } from './useVirtualizer'

export type VirtualListProps<T> = Omit<UseVirtualizerOptions, 'getScrollElement' | 'scrollElement' | 'ref' | 'count'> & {
    items: T[]
    renderItem: (item: T, index: number, virtual: VirtualItem) => React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export function VirtualList<T>({
    items,
    renderItem,
    className,
    style,
    ...options
}: VirtualListProps<T>) {
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const getScrollElement = useCallback(() => scrollRef.current, [])

    const rowVirtualizer = useVirtualizer({
        ...options,
        count: items.length,
        getScrollElement
    })

    return (
        <div
            ref={scrollRef}
            style={{
                height: options.horizontal ? undefined : 400,
                width: options.horizontal ? 400 : undefined,
                overflow: 'auto',
                ...(style || {})
            }}
            className={className}
        >
            <div
                style={{
                    height: options.horizontal ? '100%' : rowVirtualizer.getTotalSize(),
                    width: options.horizontal ? rowVirtualizer.getTotalSize() : '100%',
                    position: 'relative'
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const item = items[virtualItem.index]
                    return (
                        <div
                            key={virtualItem.key}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: options.horizontal ? virtualItem.size : '100%',
                                height: options.horizontal ? '100%' : virtualItem.size,
                                transform: options.horizontal
                                    ? `translateX(${virtualItem.start}px)`
                                    : `translateY(${virtualItem.start}px)`
                            }}
                        >
                            {renderItem(item, virtualItem.index, virtualItem)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}