import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Markdown } from './markdown'
import { MarkdownTextarea } from './markdown-textarea'

afterEach(() => {
  cleanup()
})

describe('Markdown component', () => {
  it('renders nothing when content is empty or null', () => {
    const { container: c1 } = render(<Markdown content="" />)
    expect(c1.firstChild).toBeNull()

    const { container: c2 } = render(<Markdown content={null} />)
    expect(c2.firstChild).toBeNull()
  })

  it('renders headings and paragraphs', () => {
    const markdown = `# Main Title\n\n## Sub Title\n\nThis is a paragraph text.`
    render(<Markdown content={markdown} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Main Title' }),
    ).toBeDefined()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Sub Title' }),
    ).toBeDefined()
    expect(screen.getByText('This is a paragraph text.')).toBeDefined()
  })

  it('renders external links with target="_blank" and rel="noopener noreferrer"', () => {
    const markdown = `Check out [Winterest](https://winterest.tech).`
    render(<Markdown content={markdown} />)

    const link = screen.getByRole('link', { name: /Winterest/i })
    expect(link.getAttribute('href')).toBe('https://winterest.tech')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders GFM tables correctly', () => {
    const markdown = `| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |`
    render(<Markdown content={markdown} />)

    expect(screen.getByRole('table')).toBeDefined()
    expect(screen.getByText('Header 1')).toBeDefined()
    expect(screen.getByText('Cell 1')).toBeDefined()
  })

  it('renders code blocks with copy button and language badge', () => {
    const markdown = '```ts\nconst x: number = 42;\n```'
    render(<Markdown content={markdown} />)

    expect(screen.getByText('TS')).toBeDefined()
    expect(screen.getByText('const x: number = 42;')).toBeDefined()
    expect(screen.getByRole('button', { name: /copy code/i })).toBeDefined()
  })

  it('renders inline code with custom badge styling', () => {
    const markdown = 'Use `bun test` to run test suite.'
    render(<Markdown content={markdown} />)

    const inlineCode = screen.getByText('bun test')
    expect(inlineCode.tagName.toLowerCase()).toBe('code')
  })
})

describe('MarkdownTextarea component', () => {
  it('renders textarea in write mode by default', () => {
    render(
      <MarkdownTextarea
        id="test-desc"
        name="test-desc"
        value="Initial markdown content"
        onChange={() => {}}
        labels={{
          write: 'Write',
          preview: 'Preview',
          emptyPreview: 'Empty content',
          helperText: 'Markdown supported',
        }}
      />,
    )

    expect(screen.getByDisplayValue('Initial markdown content')).toBeDefined()
    expect(screen.getByText('Markdown supported')).toBeDefined()
  })

  it('switches to preview mode when clicking preview tab', () => {
    render(
      <MarkdownTextarea
        id="test-desc"
        name="test-desc"
        value="### Preview Heading"
        onChange={() => {}}
        labels={{
          write: 'Write',
          preview: 'Preview',
          emptyPreview: 'Empty content',
          helperText: 'Markdown supported',
        }}
      />,
    )

    const previewTabButton = screen.getByRole('button', { name: /Preview/i })
    fireEvent.click(previewTabButton)

    expect(
      screen.getByRole('heading', { level: 3, name: 'Preview Heading' }),
    ).toBeDefined()
  })

  it('shows empty preview message when value is blank', () => {
    render(
      <MarkdownTextarea
        id="test-desc"
        name="test-desc"
        value=""
        onChange={() => {}}
        labels={{
          write: 'Write',
          preview: 'Preview',
          emptyPreview: 'Belum ada konten untuk dipratinjau.',
          helperText: 'Markdown supported',
        }}
      />,
    )

    const previewTabButton = screen.getByRole('button', { name: /Preview/i })
    fireEvent.click(previewTabButton)

    expect(
      screen.getByText('Belum ada konten untuk dipratinjau.'),
    ).toBeDefined()
  })
})
