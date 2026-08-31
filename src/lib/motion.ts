import type { Variants } from 'motion/react'

/**
 * Standard cubic-bezier easing curve for smooth Cloudflare + Bun UI transitions.
 */
export const easeOutCubic = [0.21, 0.47, 0.32, 0.98] as const
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const

/**
 * Default viewport trigger for scroll-driven animations.
 * Triggers once when 15% of the element enters the viewport with a small bottom offset.
 */
export const defaultViewport = {
  once: true,
  amount: 0.15,
  margin: '0px 0px -40px 0px',
} as const

/**
 * Fade In animation variant.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
}

/**
 * Fade Up (slide up with opacity) animation variant.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutCubic },
  },
}

/**
 * Fade Down (slide down with opacity) animation variant.
 */
export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
}

/**
 * Scale In (subtle pop with opacity) animation variant.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
}

/**
 * Stagger Container variant generator for lists and grids.
 */
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0.05,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

/**
 * Stagger Item variant for child cards/elements within a stagger container.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutCubic },
  },
}

/**
 * Stagger Item variant with slight scale-in for badges and icons.
 */
export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutCubic },
  },
}

/**
 * Directional timeline step variant (left/right staggered slide).
 */
export const timelineStepVariant = (isOdd: boolean): Variants => ({
  hidden: {
    opacity: 0,
    x: isOdd ? -32 : 32,
    y: 12,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easeOutCubic,
    },
  },
})

/**
 * Flowing node pop variant for timeline milestones.
 */
export const flowNodeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOutBack,
    },
  },
}

/**
 * Flowing connector path variant for workflow curves.
 */
export const flowPathVariant: Variants = {
  hidden: { pathLength: 0, opacity: 0.3 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: easeOutCubic,
    },
  },
}

/**
 * Flowing journey timeline item (slide in from left with smooth spring).
 */
export const flowJourneyStep: Variants = {
  hidden: {
    opacity: 0,
    x: -28,
    y: 8,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeOutCubic,
    },
  },
}

/**
 * Journey checkpoint node pop & glow variant.
 */
export const journeyNodeVariant = (delay = 0.05): Variants => ({
  hidden: {
    scale: 0.5,
    opacity: 0.3,
  },
  visible: {
    scale: [0.5, 1.25, 1],
    opacity: 1,
    transition: {
      duration: 0.45,
      delay,
      ease: easeOutBack,
    },
  },
})

/**
 * Journey milestone card slide & fade variant (triggered after node is reached).
 */
export const journeyCardVariant = (delay = 0.2): Variants => ({
  hidden: {
    opacity: 0,
    x: 28,
    y: 6,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.55,
      delay,
      ease: easeOutCubic,
    },
  },
})

/**
 * Journey vertical connecting line drawing variant.
 */
export const journeyLineVariant = (delay = 0.4): Variants => ({
  hidden: {
    scaleY: 0,
  },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: easeOutCubic,
    },
  },
})

/**
 * Journey traveling tracer point variant that moves along the vertical track to the next stop.
 */
export const journeyTracerVariant = (delay = 0.4): Variants => ({
  hidden: {
    top: '0%',
    opacity: 0,
  },
  visible: {
    top: '100%',
    opacity: [0, 1, 1, 0.8],
    transition: {
      duration: 0.6,
      delay,
      ease: easeOutCubic,
    },
  },
})
