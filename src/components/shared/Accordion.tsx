'use client'

import { useState } from 'react'
import type React from 'react'
import { Plus, Minus } from 'lucide-react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
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
            className={`rounded-xl mb-2 border border-bark/[0.08] transition-[background] duration-200 ease-out ${isOpen ? 'bg-surface-2' : 'bg-cream'}`}
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)' }}
              onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
              onPointerLeave={e => { (e.currentTarget as HTMLElement).style.transform = '' }}
              style={{
                width: '100%', background: 'none', border: 'none',
                padding: '16px 20px', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                gap: 16, cursor: 'pointer', textAlign: 'left',
                transition: 'transform 120ms ease-out',
              }}
            >
              <span
                style={{
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
                  background: isOpen ? 'var(--color-bark)' : 'var(--color-surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background-color 220ms cubic-bezier(0.32,0.72,0,1), transform 220ms cubic-bezier(0.32,0.72,0,1)',
                  color: isOpen ? 'var(--color-cream)' : 'var(--color-bark)',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
                }}
              >
                {isOpen
                  ? <Minus size={14} strokeWidth={2.5} />
                  : <Plus size={14} strokeWidth={2.5} />
                }
              </span>
            </button>
            <div
              id={`accordion-${item.id}`}
              style={{
                maxHeight: isOpen ? '400px' : '0px',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 280ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms ease-out',
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? 14 : 15,
                  color: 'var(--color-bark-light)',
                  lineHeight: 1.7,
                  padding: '0 20px 16px',
                  paddingRight: 64,
                }}
              >
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
