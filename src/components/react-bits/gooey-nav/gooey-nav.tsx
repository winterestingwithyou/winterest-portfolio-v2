import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '#/lib/utils'

export interface GooeyNavItem {
  label: string
  href: string
}

export interface GooeyNavProps {
  items: readonly GooeyNavItem[] | GooeyNavItem[]
  className?: string
  initialActiveIndex?: number
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: number[]
}

interface Particle {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  duration: number
  scale: number
  color: string
  size: number
  rotate: number
}

const colorPalette = [
  '#f48120', // Cloudflare orange
  '#ff9d3e', // Soft orange
  '#ff6a00', // Deep burnt orange
  '#ffd7a4', // Warm peach
  '#ff851b', // Bright amber
]

const noise = (n = 1) => n / 2 - Math.random() * n

const getXY = (
  distance: number,
  pointIndex: number,
  totalPoints: number,
): [number, number] => {
  const angle =
    ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
  return [distance * Math.cos(angle), distance * Math.sin(angle)]
}

export default function GooeyNav({
  items,
  className,
  initialActiveIndex = 0,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [75, 12],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
}: GooeyNavProps) {
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const burstCountRef = useRef(0)
  const isFirstMount = useRef(true)

  const generateParticles = (): Particle[] => {
    burstCountRef.current += 1
    const burstId = burstCountRef.current

    return Array.from({ length: particleCount }, (_, i) => {
      const rotate = noise(particleR / 10)
      const start = getXY(particleDistances[0], particleCount - i, particleCount)
      const end = getXY(
        particleDistances[1] + noise(7),
        particleCount - i,
        particleCount,
      )
      const duration =
        Math.max(
          400,
          animationTime * 1.6 + noise(timeVariance * 1.6),
        ) / 1000
      const colorIndex = colors[i % colors.length] % colorPalette.length

      return {
        id: `particle-${burstId}-${i}`,
        startX: start[0],
        startY: start[1],
        endX: end[0],
        endY: end[1],
        duration,
        scale: 1 + noise(0.3),
        color: colorPalette[colorIndex] || colorPalette[0],
        size: 16 + Math.random() * 6,
        rotate: rotate > 0 ? (rotate + particleR / 20) * 10 : (rotate - particleR / 20) * 10,
      }
    })
  }

  useEffect(() => {
    setActiveIndex(initialActiveIndex)

    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    if (initialActiveIndex >= 0) {
      setParticles(generateParticles())
    } else {
      setParticles([])
    }
  }, [initialActiveIndex, particleCount, animationTime])

  const handleItemClick = (index: number) => {
    if (activeIndex !== index) {
      setActiveIndex(index)
      setParticles(generateParticles())
    }
  }

  return (
    <>
      {/* SVG Gooey (Metaball) Filter Definition */}
      <svg
        className="pointer-events-none absolute size-0 overflow-hidden"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="gooey-nav-filter"
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav
        className={cn(
          'relative inline-flex items-center rounded-full p-1',
          'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--surface-strong)_85%,transparent),color-mix(in_srgb,var(--brand-orange-soft)_25%,transparent)),var(--surface-strong)]',
          className,
        )}
        onMouseLeave={() => setHoveredIndex(null)}
        aria-label="Main Navigation"
      >
        <ul className="relative flex items-center gap-1 list-none p-0 m-0">
          {items.map((item, index) => {
            const isActive = activeIndex === index

            return (
              <li key={item.href} className="relative">
                {/* 1. Liquid Gooey Layer (Filtered with SVG Metaball Filter) */}
                <div
                  className="pointer-events-none absolute inset-0 overflow-visible"
                  style={{ filter: 'url(#gooey-nav-filter)' }}
                  aria-hidden="true"
                >
                  {isActive && (
                    <motion.div
                      layoutId="gooey-nav-liquid-pill"
                      className="absolute inset-0 rounded-full bg-(--brand-orange)"
                      transition={{
                        type: 'spring',
                        stiffness: 360,
                        damping: 26,
                        mass: 0.8,
                      }}
                    >
                      {/* Bubbling Gooey Particles */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <AnimatePresence>
                          {particles.map((p) => (
                            <motion.span
                              key={p.id}
                              initial={{
                                x: 0,
                                y: 0,
                                scale: 0,
                                opacity: 1,
                                rotate: 0,
                              }}
                              animate={{
                                x: [0, p.startX, p.endX, 0],
                                y: [0, p.startY, p.endY, 0],
                                scale: [0, p.scale, p.scale * 0.75, 0],
                                opacity: [1, 1, 0.9, 0],
                                rotate: [0, p.rotate * 0.5, p.rotate],
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{
                                duration: p.duration,
                                ease: [0.25, 0.1, 0.25, 1],
                                times: [0, 0.35, 0.75, 1],
                              }}
                              className="pointer-events-none absolute rounded-full"
                              style={{
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                marginLeft: -p.size / 2,
                                marginTop: -p.size / 2,
                                left: '50%',
                                top: '50%',
                              }}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 2. Sharp Surface Pill (Unfiltered for clean gradient and high-contrast glow) */}
                {isActive && (
                  <motion.div
                    layoutId="gooey-nav-surface-pill"
                    className={cn(
                      'pointer-events-none absolute inset-0 rounded-full z-1',
                      'bg-[radial-gradient(circle_at_32%_20%,#ffd7a4_0_15%,transparent_22%),linear-gradient(135deg,#ff9d3e,var(--brand-orange)_60%,#c7520c)]',
                      'shadow-[0_10px_26px_rgba(244,129,32,0.36),inset_0_1px_0_rgba(255,255,255,0.4)]',
                      'border border-[color-mix(in_srgb,white_34%,transparent)]',
                    )}
                    transition={{
                      type: 'spring',
                      stiffness: 360,
                      damping: 26,
                      mass: 0.8,
                    }}
                  />
                )}

                {/* 3. Hover indicator for non-active items */}
                {hoveredIndex === index && !isActive && (
                  <motion.span
                    layoutId="gooey-nav-hover-pill"
                    className="absolute inset-0 rounded-full z-0 pointer-events-none bg-[color-mix(in_srgb,var(--brand-orange-soft)_42%,transparent)]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                {/* 4. Crisp Content Link */}
                <Link
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => handleItemClick(index)}
                  className={cn(
                    'relative z-10 inline-flex min-h-[2.15rem] items-center justify-center rounded-full px-3.5 py-1.5',
                    'text-sm transition-colors duration-180 no-underline select-none outline-hidden',
                    'focus-visible:ring-2 focus-visible:ring-(--brand-orange)',
                    isActive
                      ? 'font-extrabold text-white drop-shadow-[0_1px_2px_rgba(80,30,5,0.5)]'
                      : 'font-[750] text-(--brand-muted) hover:text-(--brand-ink)',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
