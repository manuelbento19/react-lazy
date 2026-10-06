import React, {ElementType, SyntheticEvent} from 'react'
import { useLazy } from '../hooks'
import {useImage} from "../hooks/useImage";

type LazyImageProps = {
    src: string
    alt: string
    placeholder?: string
    blur?: boolean
    width?: number
    height?: number
    ImageComponent?: ElementType
    fadeInDuration?: number
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">

export function LazyImage({
  src,
  alt,
  placeholder,
  blur = false,
  fadeInDuration = 300,
  width,
  height,
  style,
  ImageComponent = "img",
  onLoad,
  onError,
  ...rest
}: LazyImageProps) {
    const { ref, visible } = useLazy<HTMLDivElement>({})
    const { loaded, error, handleLoad, handleError, shouldLoad } = useImage({src, visible})

    const settled = loaded || error

    function handleLoadEvent(event: SyntheticEvent<HTMLImageElement, Event>) {
        handleLoad()
        onLoad?.(event)
    }

    function handleErrorEvent(event: SyntheticEvent<HTMLImageElement, Event>) {
        handleError()
        onError?.(event)
    }

    const isNextImage = ImageComponent !== "img"

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                overflow: 'hidden',
                width,
                height
            }}
        >
            {placeholder && !loaded && (
                <img
                    src={placeholder}
                    alt={alt}
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: blur ? 'blur(20px)' : 'none',
                        transform: blur ? 'scale(1.1)' : undefined
                    }}
                />
            )}
            {isNextImage ? (
                // `next/image` warns on an empty `src` and can re-download the
                // current page, so a custom image component is mounted only once
                // the image is allowed to load, or once the preload failed (so the
                // browser can surface its own broken-image state). The wrapper
                // already reserves width/height, so this causes no layout shift.
                (shouldLoad || error) && (
                    <ImageComponent
                        {...rest}
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        onLoad={handleLoadEvent}
                        onError={handleErrorEvent}
                        style={{
                            opacity: settled ? 1 : 0,
                            transition: `opacity ${fadeInDuration}ms ease`,
                            ...style
                        }}
                    />
                )
            ) : (
                <img
                    {...rest}
                    src={shouldLoad ? src : undefined}
                    alt={alt}
                    loading="lazy"
                    width={width}
                    height={height}
                    onLoad={handleLoadEvent}
                    onError={handleErrorEvent}
                    style={{
                        opacity: settled ? 1 : 0,
                        transition: `opacity ${fadeInDuration}ms ease`,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        ...style
                    }}
                />
            )}
        </div>
    )
}