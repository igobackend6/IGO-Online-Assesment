import { Fragment } from 'react'

interface MarkdownLiteProps {
  text: string
  className?: string
}

function renderInline(line: string, keyPrefix: string) {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={key} className="font-semibold text-ink-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={key} className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[0.85em] text-ink-800">
          {part.slice(1, -1)}
        </code>
      )
    }
    return <Fragment key={key}>{part}</Fragment>
  })
}

/** Tiny markdown renderer covering exactly what this app's own question text uses: paragraphs, `**bold**`, `` `code` ``, and `- ` bullet lists. */
export function MarkdownLite({ text, className = '' }: MarkdownLiteProps) {
  const blocks = text.trim().split(/\n\n+/)

  return (
    <div className={`flex flex-col gap-3 text-sm leading-relaxed text-ink-700 ${className}`}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split('\n')
        const isList = lines.every((line) => line.trim().startsWith('- '))

        if (isList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-1 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.trim().slice(2), `${blockIndex}-${lineIndex}`)}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={blockIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 && <br />}
                {renderInline(line, `${blockIndex}-${lineIndex}`)}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
