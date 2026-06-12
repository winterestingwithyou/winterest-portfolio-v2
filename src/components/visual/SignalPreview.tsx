import { Cloud, Code2, FlaskConical, Rocket } from 'lucide-react'

type SignalPreviewProps = {
  title: string
  eyebrow: string
  items: readonly string[]
  variant?: 'project' | 'lab' | 'writing' | 'stack'
  compact?: boolean
}

export function SignalPreview({
  title,
  eyebrow,
  items,
  variant = 'project',
  compact = false,
}: SignalPreviewProps) {
  const Icon =
    variant === 'lab' ? FlaskConical : variant === 'writing' ? Code2 : Rocket

  return (
    <div
      className={`signal-preview signal-preview--${variant} ${
        compact ? 'signal-preview--compact' : ''
      }`}
      aria-hidden="true"
    >
      <div className="signal-preview__chrome">
        <span />
        <span />
        <span />
      </div>
      <div className="signal-preview__header">
        <div>
          <p>{eyebrow}</p>
          <strong>{title}</strong>
        </div>
        <Icon className="size-5" />
      </div>
      <div className="signal-preview__lines">
        <span />
        <span />
        <span />
      </div>
      <div className="signal-preview__chips">
        {items.slice(0, compact ? 2 : 3).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="signal-preview__orbit">
        <Cloud className="size-4" />
        <Code2 className="size-4" />
      </div>
    </div>
  )
}
