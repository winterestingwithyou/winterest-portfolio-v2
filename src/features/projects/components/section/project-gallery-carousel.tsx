import { Layers, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '#/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#/components/ui/carousel'
import type { CarouselApi } from '#/components/ui/carousel'
import { cn } from '#/lib/utils'

export type ProjectGalleryImage = {
  url: string
  alt: string
}

type ProjectGalleryLabels = {
  label: string
  empty: string
  previous: string
  next: string
  play: string
  pause: string
  position: (current: number, total: number) => string
  goTo: (position: number) => string
}

type ProjectGalleryCarouselProps = {
  images: readonly ProjectGalleryImage[]
  labels: ProjectGalleryLabels
  fallbackLabel: string
}

export function ProjectGalleryCarousel({
  images,
  labels,
  fallbackLabel,
}: ProjectGalleryCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(true)
  const userPaused = useRef(false)
  const pointerStartedOnControl = useRef(false)
  const activePositionRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    setAutoPlayEnabled(!reducedMotion.matches)

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setAutoPlayEnabled(false)
      } else if (!userPaused.current) {
        setAutoPlayEnabled(true)
      }
    }

    reducedMotion.addEventListener('change', handleMotionChange)
    return () => reducedMotion.removeEventListener('change', handleMotionChange)
  }, [])

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === 'visible')
    }

    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () =>
      document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    if (!api) return

    const updatePosition = () => setCurrentIndex(api.selectedScrollSnap())
    updatePosition()
    api.on('select', updatePosition)
    api.on('reInit', updatePosition)

    return () => {
      api.off('select', updatePosition)
      api.off('reInit', updatePosition)
    }
  }, [api])

  useEffect(() => {
    activePositionRef.current?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [currentIndex])

  useEffect(() => {
    if (!api || !autoPlayEnabled || isHovered || !isDocumentVisible) return

    const interval = window.setInterval(() => api.scrollNext(), 5000)
    return () => window.clearInterval(interval)
  }, [api, autoPlayEnabled, isDocumentVisible, isHovered])

  const frameClassName =
    'mt-8 w-full overflow-hidden rounded-2xl border border-(--brand-line) bg-(--surface-strong)'

  if (images.length === 0) {
    return (
      <div
        role="img"
        aria-label={`${labels.empty}: ${fallbackLabel}`}
        className={cn(
          frameClassName,
          'grid aspect-21/9 place-items-center bg-(--surface-strong)',
        )}
      >
        <div className="flex flex-col items-center gap-3 text-(--brand-muted)">
          <Layers
            aria-hidden="true"
            className="size-8 text-(--brand-orange-deep)"
          />
          <span className="text-sm font-semibold">{fallbackLabel}</span>
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className={cn(frameClassName, 'aspect-21/9')}>
        <img
          src={images[0].url}
          alt={images[0].alt}
          className="size-full object-contain"
          decoding="async"
        />
      </div>
    )
  }

  const pauseForInteraction = () => {
    userPaused.current = true
    setAutoPlayEnabled(false)
  }

  const resumeAutoplay = () => {
    userPaused.current = false
    setAutoPlayEnabled(true)
  }

  return (
    <div
      className={cn(frameClassName, 'relative')}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onPointerDownCapture={(event) => {
        const target = event.target
        pointerStartedOnControl.current =
          target instanceof Element && target.closest('button') !== null
        if (!pointerStartedOnControl.current) pauseForInteraction()
      }}
      onPointerUpCapture={() => {
        pointerStartedOnControl.current = false
      }}
      onKeyDownCapture={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          pauseForInteraction()
        }
      }}
      onFocusCapture={() => {
        if (!pointerStartedOnControl.current) pauseForInteraction()
      }}
    >
      <div className="relative aspect-21/9">
        <Carousel
          aria-label={labels.label}
          className="size-full"
          opts={{ loop: true }}
          setApi={setApi}
        >
          <CarouselContent className="size-full">
            {images.map((image, index) => (
              <CarouselItem
                key={`${image.url}-${index}`}
                aria-label={labels.position(index + 1, images.length)}
                className="h-full"
              >
                <div className="aspect-21/9 w-full">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="size-full object-contain"
                    decoding="async"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            aria-label={labels.previous}
            className="size-11 border-(--brand-line) bg-(--surface-card) text-(--brand-ink) hover:border-(--brand-orange)"
            onClick={pauseForInteraction}
          />
          <CarouselNext
            aria-label={labels.next}
            className="size-11 border-(--brand-line) bg-(--surface-card) text-(--brand-ink) hover:border-(--brand-orange)"
            onClick={pauseForInteraction}
          />
        </Carousel>
      </div>

      <div className="flex min-h-12 items-center gap-3 border-t border-(--brand-line) px-3 py-2 sm:px-4">
        <div
          role="group"
          aria-label={labels.label}
          className="flex min-w-0 flex-1 items-center overflow-x-auto overscroll-x-contain"
        >
          {images.map((image, index) => (
            <button
              key={`${image.url}-position-${index}`}
              ref={currentIndex === index ? activePositionRef : undefined}
              type="button"
              aria-label={labels.goTo(index + 1)}
              aria-current={currentIndex === index ? 'true' : undefined}
              onClick={() => {
                pauseForInteraction()
                api?.scrollTo(index)
              }}
              className="group inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-orange)"
            >
              <span
                className={cn(
                  'size-2.5 rounded-full border border-(--brand-line) transition-colors',
                  currentIndex === index
                    ? 'border-(--brand-orange) bg-(--brand-orange)'
                    : 'bg-(--surface-card) group-hover:border-(--brand-orange)',
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="text-xs tabular-nums text-(--brand-muted)"
            aria-live="off"
          >
            {labels.position(currentIndex + 1, images.length)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 min-w-11"
            aria-label={autoPlayEnabled ? labels.pause : labels.play}
            onClick={() =>
              autoPlayEnabled ? pauseForInteraction() : resumeAutoplay()
            }
          >
            {autoPlayEnabled ? (
              <Pause data-icon="inline-start" />
            ) : (
              <Play data-icon="inline-start" />
            )}
            {autoPlayEnabled ? labels.pause : labels.play}
          </Button>
        </div>
      </div>
    </div>
  )
}
