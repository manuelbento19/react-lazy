import { act, fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import type { ImgHTMLAttributes } from "react"
import { LazyImage } from "../src"
import { ImageMock, IntersectionObserverMock } from "./setup"

/** component that does not forward its ref. */
function RefUnawareImage({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return <img data-testid="custom" alt={alt} {...props} />
}

/** Brings an element into view and settles the preload probe. */
function revealAndPreload() {
    const observer = IntersectionObserverMock.active
    act(() => observer?.trigger(true))
    act(() => ImageMock.last?.resolveLoad())
}

function rendered(): HTMLImageElement {
    return screen.getByTestId("custom") as HTMLImageElement
}

describe("LazyImage", () => {
    it("observes and loads with a custom ImageComponent", () => {
        render(
            <LazyImage
                ImageComponent={RefUnawareImage}
                src="/photo.jpg"
                alt="Photo"
                width={600}
                height={400}
            />
        )

        expect(IntersectionObserverMock.active).toBeDefined()
        expect(rendered().getAttribute("src")).not.toBe("/photo.jpg")

        revealAndPreload()

        expect(rendered().getAttribute("src")).toBe("/photo.jpg")
    })

    it("still loads with the native img", () => {
        render(<LazyImage src="/photo.jpg" alt="Photo" width={600} height={400} />)

        const img = screen.getByAltText("Photo") as HTMLImageElement
        expect(img.getAttribute("src")).toBeNull()

        revealAndPreload()

        expect(img.getAttribute("src")).toBe("/photo.jpg")
    })

    it("keeps the fade-in working when a custom onLoad is supplied", () => {
        const onLoad = vi.fn()

        render(
            <LazyImage
                ImageComponent={RefUnawareImage}
                src="/photo.jpg"
                alt="Photo"
                onLoad={onLoad}
            />
        )

        revealAndPreload()

        expect(rendered().style.opacity).toBe("0")

        fireEvent.load(rendered())

        expect(onLoad).toHaveBeenCalledTimes(1)
        expect(rendered().style.opacity).toBe("1")
    })

    it("calls a custom onError and reveals the image instead of hiding it", () => {
        const onError = vi.fn()

        render(
            <LazyImage
                ImageComponent={RefUnawareImage}
                src="/photo.jpg"
                alt="Photo"
                onError={onError}
            />
        )

        revealAndPreload()
        fireEvent.error(rendered())

        expect(onError).toHaveBeenCalledTimes(1)
        expect(rendered().style.opacity).toBe("1")
    })

    it("reveals the image when the preload fails", () => {
        render(
            <LazyImage
                ImageComponent={RefUnawareImage}
                src="/missing.jpg"
                alt="Photo"
            />
        )

        const observer = IntersectionObserverMock.active
        act(() => observer?.trigger(true))
        act(() => ImageMock.last?.rejectLoad())

        expect(rendered().style.opacity).toBe("1")
    })

    it("resets its state when src changes", () => {
        const { rerender } = render(
            <LazyImage ImageComponent={RefUnawareImage} src="/a.jpg" alt="Photo" />
        )

        revealAndPreload()
        fireEvent.load(rendered())
        expect(rendered().style.opacity).toBe("1")

        rerender(
            <LazyImage ImageComponent={RefUnawareImage} src="/b.jpg" alt="Photo" />
        )

        expect(rendered().style.opacity).toBe("0")
        expect(rendered().getAttribute("src")).not.toBe("/b.jpg")
    })

    it("detaches preload handlers on unmount", () => {
        const { unmount } = render(
            <LazyImage ImageComponent={RefUnawareImage} src="/photo.jpg" alt="Photo" />
        )

        revealAndPreload()
        const probe = ImageMock.last
        expect(probe?.onload).not.toBeNull()

        unmount()

        expect(probe?.onload).toBeNull()
        expect(probe?.onerror).toBeNull()
    })
})