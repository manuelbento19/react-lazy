import { useEffect, useRef, useState } from "react";

type Props = {
    src: string;
    visible: boolean;
}

export const useImage = ({src, visible}: Props) => {
    const [shouldLoad, setShouldLoad] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)

    const isFirstSrc = useRef(true)
    useEffect(() => {
        if (isFirstSrc.current) {
            isFirstSrc.current = false
            return
        }

        setShouldLoad(false)
        setLoaded(false)
        setError(false)
    }, [src])

    useEffect(() => {
        if (!visible || !src) return

        const img = new Image()
        img.src = src
        img.onload = () => setShouldLoad(true)
        img.onerror = () => setError(true)

        return () => {
            img.onload = null
            img.onerror = null
        }
    }, [visible, src])

    function handleLoad() {
        setLoaded(true)
    }

    function handleError() {
        setError(true)
    }

    return {
        handleLoad,
        handleError,
        loaded,
        error,
        shouldLoad
    }
}