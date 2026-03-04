import { useEffect, useRef } from "react"
import {LazyProps} from "./useLazy";

export type LazyCallbackProps = LazyProps &{
    onVisible: () => void
}

export const useLazyCallback = <T extends HTMLElement>({
    onVisible,
    root = null,
    rootMargin = "0px",
    threshold = 0.1,
    triggerOnce = true
}: LazyCallbackProps) => {
    const elementRef = useRef<T | null>(null)
    const hasTriggeredRef = useRef(false)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (!hasTriggeredRef.current || !triggerOnce) {
                    onVisible()
                    hasTriggeredRef.current = true
                }
                if (triggerOnce) observer.unobserve(entry.target)
            }
        }, { root, rootMargin, threshold })

        observer.observe(element)

        return () => {
            observer.unobserve(element)
            observer.disconnect()
        }
    }, [onVisible, root, rootMargin, threshold, triggerOnce])

    return { ref: elementRef }
}