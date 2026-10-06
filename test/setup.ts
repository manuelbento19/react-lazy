import { beforeEach, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

export class IntersectionObserverMock implements IntersectionObserver {
    static instances: IntersectionObserverMock[] = []

    readonly root: Element | Document | null = null
    readonly rootMargin = ""
    readonly thresholds: ReadonlyArray<number> = []

    targets = new Set<Element>()
    disconnected = false

    constructor(private callback: IntersectionObserverCallback) {
        IntersectionObserverMock.instances.push(this)
    }

    static reset() {
        IntersectionObserverMock.instances = []
    }

    static get active(): IntersectionObserverMock | undefined {
        return [...IntersectionObserverMock.instances]
            .reverse()
            .find((instance) => !instance.disconnected && instance.targets.size > 0)
    }

    observe(target: Element) {
        this.targets.add(target)
    }

    unobserve(target: Element) {
        this.targets.delete(target)
    }

    disconnect() {
        this.targets.clear()
        this.disconnected = true
    }

    takeRecords(): IntersectionObserverEntry[] {
        return []
    }

    /** Reports the given visibility against every currently observed target. */
    trigger(isIntersecting: boolean) {
        const entries = [...this.targets].map(
            (target) =>
                ({
                    target,
                    isIntersecting,
                    intersectionRatio: isIntersecting ? 1 : 0
                }) as IntersectionObserverEntry
        )

        if (entries.length > 0) {
            this.callback(entries, this)
        }
    }
}

export class ImageMock {
    static instances: ImageMock[] = []

    onload: (() => void) | null = null
    onerror: (() => void) | null = null

    private currentSrc = ""

    constructor() {
        ImageMock.instances.push(this)
    }

    static reset() {
        ImageMock.instances = []
    }

    static get last(): ImageMock | undefined {
        return ImageMock.instances[ImageMock.instances.length - 1]
    }

    set src(value: string) {
        this.currentSrc = value
    }

    get src(): string {
        return this.currentSrc
    }

    resolveLoad() {
        this.onload?.()
    }

    rejectLoad() {
        this.onerror?.()
    }
}

globalThis.IntersectionObserver =
    IntersectionObserverMock as unknown as typeof IntersectionObserver
globalThis.Image = ImageMock as unknown as typeof Image

beforeEach(() => {
    IntersectionObserverMock.reset()
    ImageMock.reset()
})

afterEach(() => {
    cleanup()
})
if (typeof ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    globalThis.ResizeObserver = ResizeObserver as unknown as typeof ResizeObserver
}
