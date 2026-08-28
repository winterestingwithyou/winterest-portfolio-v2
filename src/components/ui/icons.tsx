import type { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement>

/**
 * TikTok brand icon SVG
 */
export function TikTokIcon({ className = 'size-4', ...props }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.32 0 .63.06.92.16V9.16a6.34 6.34 0 0 0-.92-.07 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.28 8.28 0 0 0 4.77 1.5V7.1a4.85 4.85 0 0 1-1.01-.41z" />
    </svg>
  )
}
