import { useEffect, useRef } from "react"
import { useIntersection } from "./useIntersection";
import { LazyCallbackProps } from "../types";

export const useLazyCallback = <T extends HTMLElement = HTMLDivElement>({
    onVisible,
    root,
    rootMargin,
    threshold,
    triggerOnce
}: LazyCallbackProps) => {
    const onVisibleRef = useRef(onVisible)
    useEffect(() => {
        onVisibleRef.current = onVisible
    })

    const { ref } = useIntersection<T>({
        root,
        rootMargin,
        threshold,
        triggerOnce,
        onIntersect: () => onVisibleRef.current()
    })

    return { ref }
}