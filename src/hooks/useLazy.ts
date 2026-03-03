import { useEffect, useRef, useState } from 'react'

export type LazyProps = {
    root?: Element | null
    rootMargin?: string
    threshold?: number | number[]
    triggerOnce?: boolean
}

export const useLazy =  <T extends HTMLElement>({
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = true
}: LazyProps) => {
    const ref = useRef<T | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true)
                if (triggerOnce) observer.unobserve(entry.target)
            } else if (!triggerOnce) {
                setVisible(false)
            }
        }, { root, rootMargin, threshold })

        observer.observe(element);

        return () => {
            observer.unobserve(element)
            observer.disconnect()
        }
    }, [root, rootMargin, threshold, triggerOnce])

    return { ref, visible }
}
