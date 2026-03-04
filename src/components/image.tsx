import React, {ElementType} from 'react'
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
  ...rest
}: LazyImageProps) {
    const { ref, visible } = useLazy<HTMLImageElement>({})
    const { loaded, handleLoad, shouldLoad } = useImage({src, visible})

    const isNextImage = ImageComponent !== "img"

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            width,
            height
        }}>
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
                <ImageComponent
                    src={shouldLoad ? src : ""}
                    alt={alt}
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: `opacity ${fadeInDuration}ms ease`,
                        ...style
                    }}
                    {...rest}
                />
            ) : (
                <img
                    ref={ref}
                    src={shouldLoad ? src : undefined}
                    alt={alt}
                    loading="lazy"
                    width={width}
                    height={height}
                    onLoad={handleLoad}
                    style={{
                        opacity: loaded ? 1 : 0,
                        transition: `opacity ${fadeInDuration}ms ease`,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        ...style
                    }}
                    {...rest}
                />
            )}
        </div>
    )
}