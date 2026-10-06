import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { useVirtualizer } from "../src/virtual"
import { IntersectionObserverMock } from "./setup"

afterEach(() => {
    if (typeof globalThis.IntersectionObserver === "undefined") {
        globalThis.IntersectionObserver =
            IntersectionObserverMock as unknown as typeof IntersectionObserver
    }
})

function createScrollEl() {
    const el = document.createElement('div')
    Object.defineProperty(el, 'scrollTop', { writable: true, value: 0 })
    Object.defineProperty(el, 'clientHeight', { writable: true, value: 200 })
    Object.defineProperty(el, 'scrollLeft', { writable: true, value: 0 })
    Object.defineProperty(el, 'clientWidth', { writable: true, value: 200 })
    return el
}

describe('useVirtualizer', () => {
    it('returns virtual items for fixed-size list', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 100,
                getScrollElement: () => scrollEl,
                itemSize: 50,
                overscan: 0
            })
        )

        const items = result.current.getVirtualItems()
        expect(items.length).toBeGreaterThan(0)
        expect(items[0].index).toBe(0)
        expect(items[0].size).toBe(50)
        expect(result.current.getTotalSize()).toBe(5000)
    })

    it('respects overscan', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 100,
                getScrollElement: () => scrollEl,
                itemSize: 50,
                overscan: 2
            })
        )

        const items = result.current.getVirtualItems()
        expect(items.length).toBeGreaterThan(4)
    })

    it('supports horizontal', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 50,
                getScrollElement: () => scrollEl,
                itemSize: 100,
                horizontal: true
            })
        )

        const items = result.current.getVirtualItems()
        expect(items[0].size).toBe(100)
        expect(result.current.getTotalSize()).toBe(5000)
    })


    it('emits strictly monotonic, non-overlapping positions', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 100,
                getScrollElement: () => scrollEl,
                itemSize: 50,
                paddingStart: 10,
                paddingEnd: 20
            })
        )

        const items = result.current.getVirtualItems()
        expect(items.length).toBeGreaterThan(3)
        items.forEach((item, i) => {
            expect(item.start).toBe(10 + item.index * 50)
            expect(item.end).toBe(item.start + item.size)
            if (i > 0) expect(item.start).toBe(items[i - 1].end)
        })

        // o total so pode bater com as posicoes quando a janela chega ao fim
        act(() => {
            scrollEl.scrollTop = 4830
            scrollEl.dispatchEvent(new Event('scroll'))
        })

        const tail = result.current.getVirtualItems()
        expect(tail[tail.length - 1].index).toBe(99)
        expect(tail[tail.length - 1].end + 20).toBe(result.current.getTotalSize())
    })

    it('windows the list by scrollOffset, not by search', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 100,
                getScrollElement: () => scrollEl,
                itemSize: 50,
                overscan: 0
            })
        )

        act(() => {
            scrollEl.scrollTop = 150
            scrollEl.dispatchEvent(new Event('scroll'))
        })

        const items = result.current.getVirtualItems()
        expect(items.map((i) => i.index)).toEqual([3, 4, 5, 6])
        expect(items[0].start).toBe(150)
        expect(items[items.length - 1].end).toBe(350)
    })

    it('falls back to itemSize 40 when omitted', () => {
        const scrollEl = createScrollEl()
        const { result } = renderHook(() =>
            useVirtualizer({
                count: 10,
                getScrollElement: () => scrollEl
            })
        )

        const items = result.current.getVirtualItems()
        expect(items[0].size).toBe(40)
        expect(result.current.getTotalSize()).toBe(400)
    })

    it("rejects estimateSize: /virtual is fixed-size only", () => {
        renderHook(() =>
            useVirtualizer({
                count: 10,
                getScrollElement: () => null,
                itemSize: 40,
                // @ts-expect-error estimateSize was removed in 1.3.0 — use itemSize
                estimateSize: () => 40
            })
        )
        expect(true).toBe(true)
    })
})
