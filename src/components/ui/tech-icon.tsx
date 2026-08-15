import { Code2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '#/lib/utils'

export interface TechIconProps {
  src?: string | null
  name?: string | null
  alt?: string | null
  className?: string
  color?: string | null
}

export function TechIcon({ src, name, alt, className, color }: TechIconProps) {
  const iconUrl =
    src ||
    (name &&
    (name.startsWith('http://') ||
      name.startsWith('https://') ||
      name.startsWith('/'))
      ? name
      : null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [iconUrl])

  const customStyle = color ? { color } : undefined

  if (!iconUrl || hasError) {
    return (
      <Code2
        className={cn('size-5 text-(--brand-muted)', className)}
        style={customStyle}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      src={iconUrl}
      alt={alt || name || 'Tech icon'}
      className={cn('size-5 object-contain', className)}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}
