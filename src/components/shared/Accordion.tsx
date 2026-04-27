'use client'

import { useState } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  isMobile?: boolean
}

export function Accordion({ items, isMobile = false }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openId === item.id
        return (
          <div
            key={item.id}
            style={{
              borderTop: '1px solid rgba(61,53,48,0.1)',
              ...(i === items.length - 1 ? { borderBottom: '1px solid rgba(61,53,48,0.1)' } : {}),
            }}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '12px 0', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                gap: 16, cursor: 'pointer', textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 15 : 17,
                  fontWeight: 500,
                  color: 'var(--color-bark)',
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                  background: isOpen ? 'var(--color-bark)' : '#F0EBE4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 200ms ease',
                  fontSize: 18, lineHeight: 1,
                  color: isOpen ? 'var(--color-cream)' : 'var(--color-bark)',
                }}
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              id={`accordion-${item.id}`}
              style={{
                maxHeight: isOpen ? '400px' : '0px',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 320ms ease, opacity 220ms ease',
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: isMobile ? 14 : 15,
                  color: 'var(--color-bark-light)',
                  lineHeight: 1.7,
                  margin: '0 0 22px',
                  paddingRight: 44,
                }}
              >
                {item.content}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
