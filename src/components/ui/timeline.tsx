import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

import { cn } from '#/lib/utils'

export interface TimelineEntry {
  title: string
  tagline?: string
  content: React.ReactNode
}

interface TimelineProps {
  data: TimelineEntry[]
  className?: string
}

export function Timeline({ data, className }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setHeight(rect.height)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 25%', 'end 75%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <div ref={ref} className="relative pb-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="group flex justify-start pt-8 md:gap-8 md:pt-12"
          >
            {/* Sticky Left Column with Checkpoint Dot and Year Header */}
            <div className="sticky top-28 z-30 flex max-w-xs flex-col items-center self-start md:w-full md:max-w-xs md:flex-row md:gap-4">
              {/* Checkpoint Node Dot */}
              <div className="absolute left-2.5 flex size-8 items-center justify-center rounded-full border border-(--brand-line) bg-(--site-bg) shadow-xs transition-colors group-hover:border-(--brand-orange)">
                <div className="size-3 rounded-full border border-(--brand-orange)/40 bg-(--brand-orange-soft) transition-colors group-hover:bg-(--brand-orange)" />
              </div>

              {/* Title / Year on Desktop */}
              <div className="hidden pl-16 md:block">
                <h3 className="text-2xl font-black uppercase tracking-wider text-(--brand-orange-deep) lg:text-3xl">
                  {item.title}
                </h3>
                {item.tagline ? (
                  <p className="mt-0.5 text-xs font-semibold italic text-(--brand-muted)">
                    {item.tagline}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Right Column with Milestone Content */}
            <div className="relative w-full pl-14 pr-2 md:pl-2">
              {/* Title on Mobile */}
              <div className="mb-3 md:hidden">
                <h3 className="text-xl font-black uppercase tracking-wider text-(--brand-orange-deep)">
                  {item.title}
                </h3>
                {item.tagline ? (
                  <p className="text-xs font-semibold italic text-(--brand-muted)">
                    {item.tagline}
                  </p>
                ) : null}
              </div>

              {item.content}
            </div>
          </div>
        ))}

        {/* Vertical Track Rail and Scroll-Linked Glowing Beam */}
        <div
          style={{
            height: `${height}px`,
          }}
          className="absolute left-[25px] top-0 w-0.5 overflow-hidden bg-linear-to-b from-transparent via-(--brand-line) to-transparent"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-0.5 rounded-full bg-linear-to-b from-(--brand-orange) via-(--brand-orange) to-(--brand-orange-deep) shadow-[0_0_12px_var(--brand-orange)]"
          />
        </div>
      </div>
    </div>
  )
}
