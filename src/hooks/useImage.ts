import {useEffect, useState} from "react";

type Props = {
    src: string;
    visible: boolean;
}

export const useImage = ({src, visible}: Props) => {
    const [shouldLoad, setShouldLoad] = useState(false)
    const [loaded, setLoaded] = useState(false)

    function handleLoad() {
        setLoaded(true)
    }

    useEffect(() => {
        if (!visible || !src) return

        const img = new Image()
        img.src = src
        img.onload = () => {
            setShouldLoad(true)
        }
    }, [visible, src])

    return {
        handleLoad,
        loaded,
        shouldLoad
    }
}