import { Check, Copy, ExternalLink } from 'lucide-react'
import React, { createContext, useContext, useState } from 'react'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '#/lib/utils'

const PreContext = createContext(false)

function CodeBlock({
  children,
  className,
  ...props
}: React.ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)

  let codeString = ''
  let language = ''

  if (React.isValidElement(children)) {
    const codeElement = children as React.ReactElement<{
      className?: string
      children?: React.ReactNode
    }>
    const langMatch = /language-(\w+)/.exec(codeElement.props.className || '')
    if (langMatch) {
      language = langMatch[1]
    }
    codeString = String(codeElement.props.children ?? '').replace(/\n$/, '')
  } else {
    codeString = String(children ?? '').replace(/\n$/, '')
  }

  const handleCopy = async () => {
    if (!codeString) return
    try {
      await navigator.clipboard.writeText(codeString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code to clipboard', err)
    }
  }

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-(--brand-line) bg-(--brand-dark) text-slate-100 shadow-md">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono font-medium tracking-wider text-(--brand-orange)">
          {language ? language.toUpperCase() : 'CODE'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied code' : 'Copy code'}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre
        className={cn(
          'overflow-x-auto p-4 font-mono text-sm leading-relaxed text-slate-200 no-scrollbar',
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}

const markdownComponents: Components = {
  pre: ({ node: _node, ...props }) => (
    <PreContext.Provider value={true}>
      <CodeBlock {...props} />
    </PreContext.Provider>
  ),
  code: ({ node: _node, className, children, ...props }) => {
    const isInsidePre = useContext(PreContext)
    if (isInsidePre) {
      return (
        <code className={cn('font-mono text-sm', className)} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code
        className={cn(
          'rounded-md border border-(--brand-line) bg-(--brand-orange-soft) px-1.5 py-0.5 font-mono text-[0.875em] font-semibold text-(--brand-orange-deep) dark:bg-black/40 dark:text-(--brand-orange)',
          className,
        )}
        {...props}
      >
        {children}
      </code>
    )
  },
  a: ({ node: _node, href, children, className, ...props }) => {
    const isExternal =
      href?.startsWith('http://') || href?.startsWith('https://')
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={cn(
          'inline-flex items-center gap-1 font-semibold text-(--brand-orange-deep) underline decoration-(--brand-line) underline-offset-4 transition hover:text-(--brand-orange) hover:decoration-(--brand-orange)',
          className,
        )}
        {...props}
      >
        {children}
        {isExternal && (
          <ExternalLink
            className="inline size-3 shrink-0 opacity-70"
            aria-hidden="true"
          />
        )}
      </a>
    )
  },
  table: ({ node: _node, children, className, ...props }) => (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-(--brand-line) bg-surface">
      <table
        className={cn('w-full border-collapse text-left text-sm', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({ node: _node, children, className, ...props }) => (
    <thead
      className={cn(
        'border-b border-(--brand-line) bg-(--brand-orange-soft)/50 dark:bg-white/5 font-semibold text-(--brand-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  ),
  th: ({ node: _node, children, className, ...props }) => (
    <th
      className={cn(
        'px-4 py-3 text-xs font-bold uppercase tracking-wider text-(--brand-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ node: _node, children, className, ...props }) => (
    <td
      className={cn(
        'border-b border-(--brand-line)/50 px-4 py-3 text-(--brand-ink) last:border-b-0',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  ),
  blockquote: ({ node: _node, children, className, ...props }) => (
    <blockquote
      className={cn(
        'my-4 rounded-r-lg border-l-4 border-(--brand-orange) bg-(--brand-orange-soft)/30 px-4 py-2 italic text-(--brand-muted) dark:bg-white/5',
        className,
      )}
      {...props}
    >
      {children}
    </blockquote>
  ),
  img: ({ node: _node, src, alt, className, ...props }) => (
    <img
      src={src}
      alt={alt || ''}
      loading="lazy"
      className={cn(
        'my-4 h-auto max-w-full rounded-xl border border-(--brand-line) object-cover shadow-sm',
        className,
      )}
      {...props}
    />
  ),
  h1: ({ node: _node, children, className, ...props }) => (
    <h1
      className={cn(
        'mt-8 mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node: _node, children, className, ...props }) => (
    <h2
      className={cn(
        'mt-6 mb-3 text-xl font-bold tracking-tight text-(--brand-ink) sm:text-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, className, ...props }) => (
    <h3
      className={cn(
        'mt-5 mb-2 text-lg font-bold text-(--brand-ink) sm:text-xl',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ node: _node, children, className, ...props }) => (
    <h4
      className={cn(
        'mt-4 mb-2 text-base font-bold text-(--brand-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ node: _node, children, className, ...props }) => (
    <p
      className={cn(
        'mb-4 leading-relaxed text-(--brand-ink) last:mb-0',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  ),
  ul: ({ node: _node, children, className, ...props }) => (
    <ul
      className={cn(
        'my-4 ml-6 list-disc space-y-1 text-(--brand-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ node: _node, children, className, ...props }) => (
    <ol
      className={cn(
        'my-4 ml-6 list-decimal space-y-1 text-(--brand-ink)',
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ node: _node, children, className, ...props }) => (
    <li className={cn('leading-relaxed', className)} {...props}>
      {children}
    </li>
  ),
  hr: ({ node: _node, className, ...props }) => (
    <hr className={cn('my-6 border-(--brand-line)', className)} {...props} />
  ),
}

export type MarkdownProps = {
  content?: string | null
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  if (!content) return null

  return (
    <div
      className={cn(
        'prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-(--brand-ink)',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
