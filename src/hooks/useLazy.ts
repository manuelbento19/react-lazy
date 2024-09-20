import { MutableRefObject, useEffect, useState, useTransition } from 'react'

type LazyProps = {
  elementRef: MutableRefObject<Element | null>
}

export const useLazy = ({ elementRef }: LazyProps) => {
  const [visible, setVisibe] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const currentRef = elementRef.current

    const observer = new IntersectionObserver((observers) => {
      const myImage = observers[0]
      if (myImage.isIntersecting) {
        startTransition(() => setVisibe(true))
        if (currentRef) observer.unobserve(currentRef)
      }
    })

    if (currentRef) {
      observer.observe(currentRef)
    }
    return () => {
      if (currentRef) {
        observer.observe(currentRef)
      }
      observer.disconnect()
    }
  }, [])

  return {
    visible,
    isPending
  }
}
