import React from 'react'
import { useLazy } from '../hooks'
import {useImage} from "../hooks/useImage";

interface LazyImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    placeholder?: string
    blur?: boolean
    fadeInDuration?: number
}

export function LazyImage({
      src,
      alt,
      placeholder,
      blur = false,
      fadeInDuration = 300,
      width,
      height,
      style,
      ...rest
  }: LazyImageProps) {
    const { ref, visible } = useLazy<HTMLImageElement>({})
    const { loaded, handleLoad, shouldLoad } = useImage({src, visible})

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
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    ...style
                }}
                {...rest}
            />
        </div>
    )
}