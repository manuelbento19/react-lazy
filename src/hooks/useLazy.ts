import { useIntersection } from './useIntersection'
import { UseLazyProps } from '../types'

export const useLazy = <T extends HTMLElement = HTMLDivElement>({
    root,
    rootMargin,
    threshold,
    triggerOnce
}: UseLazyProps = {}) => useIntersection<T>({ root, rootMargin, threshold, triggerOnce })