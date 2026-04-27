'use client'

interface RichTextNode {
  type: string
  value?: string
  bold?: boolean
  italic?: boolean
  listType?: 'ordered' | 'unordered'
  children?: RichTextNode[]
}

function renderNode(node: RichTextNode, key: number): React.ReactNode {
  switch (node.type) {
    case 'root':
      return <>{node.children?.map((c, i) => renderNode(c, i))}</>
    case 'paragraph':
      return <p key={key} style={{ margin: '0 0 8px' }}>{node.children?.map((c, i) => renderNode(c, i))}</p>
    case 'list':
      return node.listType === 'ordered'
        ? <ol key={key} style={{ margin: '0 0 8px', paddingLeft: 20, listStyleType: 'decimal' }}>{node.children?.map((c, i) => renderNode(c, i))}</ol>
        : <ul key={key} style={{ margin: '0 0 8px', paddingLeft: 20, listStyleType: 'disc' }}>{node.children?.map((c, i) => renderNode(c, i))}</ul>
    case 'list-item':
      return <li key={key} style={{ marginBottom: 4, display: 'list-item' }}>{node.children?.map((c, i) => renderNode(c, i))}</li>
    case 'heading':
      return <strong key={key} style={{ display: 'block', marginBottom: 6 }}>{node.children?.map((c, i) => renderNode(c, i))}</strong>
    case 'text': {
      let el: React.ReactNode = node.value ?? ''
      if (node.bold) el = <strong key={key}>{el}</strong>
      if (node.italic) el = <em key={key}>{el}</em>
      return el
    }
    default:
      return node.children?.map((c, i) => renderNode(c, i)) ?? null
  }
}

export function RichText({ value, style }: { value?: string; style?: React.CSSProperties }) {
  if (!value) return null
  let parsed: RichTextNode
  try {
    parsed = JSON.parse(value) as RichTextNode
  } catch {
    return <span style={style}>{value}</span>
  }
  return (
    <div style={{ fontSize: 14, lineHeight: 1.6, color: 'inherit', ...style }}>
      {renderNode(parsed, 0)}
    </div>
  )
}
