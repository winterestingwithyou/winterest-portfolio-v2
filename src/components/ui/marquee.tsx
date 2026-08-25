import type { ComponentPropsWithoutRef } from 'react'
import { useState } from 'react'
import { motion } from 'motion/react'

import { cn } from '#/lib/utils'

interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 6
   */
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 6,
  ...props
}: MarqueeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden p-2',
        vertical ? 'flex-col' : 'flex-row',
        className,
      )}
      style={{
        gap: '1.5rem',
        ...props.style,
      }}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <motion.div
          key={i}
          aria-hidden={i > 0}
          animate={
            isHovered && pauseOnHover
              ? false
              : {
                  x: vertical
                    ? 0
                    : reverse
                      ? ['-100%', '0%']
                      : ['0%', '-100%'],
                  y: !vertical
                    ? 0
                    : reverse
                      ? ['-100%', '0%']
                      : ['0%', '-100%'],
                }
          }
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
            y: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 30,
              ease: 'linear',
            },
          }}
          className={cn(
            'flex shrink-0 items-center gap-6',
            vertical ? 'flex-col' : 'flex-row',
          )}
        >
          {children}
        </motion.div>
      ))}
    </div>
  )
}
