import { useEffect, useRef, useState } from 'react'
import { IntersectionOptions } from '../types'

export function useIntersection<T extends HTMLElement = HTMLDivElement>({
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    triggerOnce = true,
    onIntersect
}: IntersectionOptions = {}) {
    const ref = useRef<T | null>(null)
    const [visible, setVisible] = useState(false)

    const onIntersectRef = useRef(onIntersect)
    useEffect(() => {
        onIntersectRef.current = onIntersect
    })

    useEffect(() => {
        const element = ref.current
        if (!element) return;

        if (typeof IntersectionObserver === 'undefined') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true)
            onIntersectRef.current?.()
            return
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                onIntersectRef.current?.()
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