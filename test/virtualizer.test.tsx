import { act, render, renderHook } from "@testing-library/react"
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
})
