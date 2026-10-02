export type IntersectionOptions = {
    root?: Element | null
    rootMargin?: string
    threshold?: number | number[]
    triggerOnce?: boolean
    onIntersect?: () => void
}

export type UseLazyProps = Omit<IntersectionOptions, 'onIntersect'>

export type LazyCallbackProps = UseLazyProps & {
    onVisible: () => void
}