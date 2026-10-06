import { render, screen } from "@testing-library/react"
import { describe, expect, it, beforeAll } from "vitest"
import { VirtualList } from "../src/virtual"

function stubViewport() {
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
        configurable: true,
        value: 200
    })
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        value: 200
    })
}

beforeAll(() => {
    stubViewport()
})

describe("VirtualList", () => {
    it("renders only the visible window of items", () => {
        const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`)

        render(<VirtualList items={items} itemSize={50} renderItem={(item) => <span>{item}</span>} />)

        expect(screen.getByText("Item 0")).toBeTruthy()
        expect(screen.queryByText("Item 999")).toBeNull()
        expect(screen.queryAllByText(/Item /).length).toBeLessThan(20)
    })

    it("derives total size from itemSize and items length", () => {
        const items = Array.from({ length: 100 }, (_, i) => i)

        const { container } = render(
            <VirtualList items={items} itemSize={50} renderItem={(item) => <span>{item}</span>} />
        )

        const outer = container.firstElementChild as HTMLElement
        const inner = outer.firstElementChild as HTMLElement
        expect(inner.style.height).toBe("5000px")
    })

    it("applies overscan and horizontal axis", () => {
        const items = Array.from({ length: 500 }, (_, i) => i)

        render(
            <VirtualList
                items={items}
                itemSize={100}
                overscan={3}
                horizontal
                renderItem={(item) => <span>{item}</span>}
            />
        )

        expect(screen.getByText("0")).toBeTruthy()
        expect(screen.queryByText("499")).toBeNull()
    })
})
