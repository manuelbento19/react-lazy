import { render, screen } from "@testing-library/react"
import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { VirtualList } from "../src/virtual"

beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
        configurable: true,
        value: 200
    })
})

const originalResizeObserver = globalThis.ResizeObserver

afterEach(() => {
    if (originalResizeObserver) {
        globalThis.ResizeObserver = originalResizeObserver
    } else {
        delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver
    }
})

describe("VirtualList em ambientes sem ResizeObserver", () => {
    it("renderiza sem lancar erro quando ResizeObserver nao existe", () => {
        delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver

        expect(() => {
            render(
                <VirtualList
                    items={[1, 2, 3]}
                    itemSize={20}
                    renderItem={(item) => <span>{item}</span>}
                />
            )
        }).not.toThrow()

        expect(screen.getByText("1")).toBeTruthy()
    })
})
