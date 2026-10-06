import { renderToString } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"
import { LazyComponent, LazySentinel, LazySuspense } from "../src"
import { VirtualList } from "../src/virtual"

describe("SSR safety", () => {
    it("renders on the server without useLayoutEffect warnings", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {})

        const html = renderToString(
            <div>
                <LazySuspense fallback="loading">
                    <span>app</span>
                </LazySuspense>
                <LazyComponent fallback="loading">
                    <span>comp</span>
                </LazyComponent>
                <LazySentinel onVisible={() => {}} />
                <VirtualList
                    items={[1, 2, 3]}
                    itemSize={20}
                    renderItem={(item) => <span>{item}</span>}
                />
            </div>
        )

        const warnings = error.mock.calls.flat().join("\n")
        error.mockRestore()

        expect(html).toContain("loading")
        expect(warnings).not.toContain("useLayoutEffect")
    })
})
