import { act, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LazyComponent, useLazy, useLazyCallback } from "../src"
import { IntersectionObserverMock } from "./setup"

function withoutIntersectionObserver(): () => void {
    const globals = globalThis as { IntersectionObserver?: typeof IntersectionObserver }
    const original = globals.IntersectionObserver
    delete globals.IntersectionObserver

    return () => {
        globals.IntersectionObserver = original
    }
}

afterEach(() => {
    if (typeof globalThis.IntersectionObserver === "undefined") {
        globalThis.IntersectionObserver =
            IntersectionObserverMock as unknown as typeof IntersectionObserver
    }
})

function Visible({ triggerOnce = true }: { triggerOnce?: boolean }) {
    const { ref, visible } = useLazy<HTMLDivElement>({ triggerOnce })

    return <div ref={ref}>{visible ? "VISIBLE" : "HIDDEN"}</div>
}

function Probe({ onVisible }: { onVisible: () => void }) {
    const { ref } = useLazyCallback<HTMLDivElement>({ onVisible })

    return <div ref={ref} data-testid="probe" />
}

describe("useLazy", () => {
    it("reports visibility from the observer", () => {
        render(<Visible />)

        expect(screen.getByText("HIDDEN")).toBeDefined()

        act(() => IntersectionObserverMock.active?.trigger(true))

        expect(screen.getByText("VISIBLE")).toBeDefined()
    })

    it("stops observing after the first hit when triggerOnce is set", () => {
        render(<Visible />)

        const observer = IntersectionObserverMock.active!
        act(() => observer.trigger(true))

        expect(observer.targets.size).toBe(0)
    })

    it("toggles back to hidden when triggerOnce is off", () => {
        render(<Visible triggerOnce={false} />)

        const observer = IntersectionObserverMock.active!
        act(() => observer.trigger(true))
        expect(screen.getByText("VISIBLE")).toBeDefined()

        act(() => observer.trigger(false))
        expect(screen.getByText("HIDDEN")).toBeDefined()
    })

    it("becomes visible when IntersectionObserver is unavailable", () => {
        const restore = withoutIntersectionObserver()

        render(<Visible />)
        expect(screen.getByText("VISIBLE")).toBeDefined()

        restore()
    })
})

describe("server rendering", () => {
    it("renders the fallback so the client hydrates matching markup", () => {
        const restore = withoutIntersectionObserver()

        const html = renderToStaticMarkup(
            <LazyComponent fallback={<span>FALLBACK</span>}>
                <span>CONTENT</span>
            </LazyComponent>
        )

        restore()

        expect(html).toContain("FALLBACK")
        expect(html).not.toContain("CONTENT")
    })
})

describe("useLazyCallback", () => {
    it("invokes onVisible once when the element intersects", () => {
        const onVisible = vi.fn()
        render(<Probe onVisible={onVisible} />)

        const observer = IntersectionObserverMock.active!
        act(() => observer.trigger(true))
        act(() => observer.trigger(true))

        expect(onVisible).toHaveBeenCalledTimes(1)
    })

    it("does not rebuild the observer when onVisible identity changes", () => {
        const first = vi.fn()
        const second = vi.fn()

        const { rerender } = render(<Probe onVisible={first} />)
        const observer = IntersectionObserverMock.active!

        rerender(<Probe onVisible={second} />)

        expect(IntersectionObserverMock.active).toBe(observer)

        act(() => observer.trigger(true))

        expect(first).not.toHaveBeenCalled()
        expect(second).toHaveBeenCalledTimes(1)
    })

    it("invokes onVisible when IntersectionObserver is unavailable", () => {
        const onVisible = vi.fn()
        const restore = withoutIntersectionObserver()

        render(<Probe onVisible={onVisible} />)

        expect(onVisible).toHaveBeenCalledTimes(1)
        restore()
    })
})