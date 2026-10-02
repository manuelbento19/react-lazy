import { act, render, screen } from "@testing-library/react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { LazySentinel } from "../src"
import { IntersectionObserverMock } from "./setup"

describe("LazySentinel", () => {
    it("calls onVisible when intersecting", () => {
        const onVisible = vi.fn()
        render(<LazySentinel onVisible={onVisible} data-testid="sentinel" />)

        const observer = IntersectionObserverMock.active!
        expect(observer).toBeDefined()

        act(() => observer.trigger(true))
        act(() => observer.trigger(true))

        expect(onVisible).toHaveBeenCalledTimes(1)
    })

    it("renders as hidden sentinel by default", () => {
        const onVisible = vi.fn()
        render(<LazySentinel onVisible={onVisible} data-testid="sentinel" />)

        const el = screen.getByTestId("sentinel") as HTMLDivElement
        expect(el.style.visibility).toBe("hidden")
        expect(el.style.height).toBe("0px")
        expect(el.getAttribute("aria-hidden")).toBe("true")
    })

    it("respects triggerOnce=false", () => {
        const onVisible = vi.fn()
        render(<LazySentinel onVisible={onVisible} triggerOnce={false} />)

        const observer = IntersectionObserverMock.active!
        act(() => observer.trigger(true))
        act(() => observer.trigger(false))
        act(() => observer.trigger(true))

        expect(onVisible).toHaveBeenCalledTimes(2)
    })

    it("renders without crashing on SSR", () => {
        const onVisible = vi.fn()
        const html = renderToStaticMarkup(
            <LazySentinel onVisible={onVisible} data-testid="s" />
        )
        expect(html).toContain("aria-hidden")
        expect(html).not.toContain("visible")
    })
})