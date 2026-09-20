'use client'

import { createContext, use, useState, type ReactNode } from 'react'
import { Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface AccordionContextValue {
  openId: string | null
  toggle: (id: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordion(): AccordionContextValue {
  const ctx = use(AccordionContext)
  if (!ctx) throw new Error('Accordion.Item must be used within <Accordion>')
  return ctx
}

interface AccordionItemViewProps {
  id: string
  title: string
  children: ReactNode
}

function AccordionItemView({ id, title, children }: AccordionItemViewProps) {
  const { openId, toggle } = useAccordion()
  const isOpen = openId === id

  return (
    <div
      className={cn(
        'mb-2 rounded-xl border border-bark/[0.08] transition-[background] duration-200 ease-out',
        isOpen ? 'bg-surface-2' : 'bg-cream'
      )}
    >
      <button
        type="button"
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
        aria-controls={`accordion-${id}`}
        className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-5 py-4 text-left transition-transform duration-[120ms] ease-out active:scale-[0.98]"
      >
        <span className="text-[15px] font-medium leading-[1.4] text-bark md:text-[17px]">{title}</span>
        <span
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-full transition-colors duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)]',
            isOpen ? 'bg-bark text-cream' : 'bg-surface-2 text-bark'
          )}
        >
          {isOpen ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
        </span>
      </button>
      <div
        id={`accordion-${id}`}
        className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-[280ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-5 pb-4 text-sm leading-[1.7] text-bark-light md:text-[15px]">{children}</div>
      </div>
    </div>
  )
}

interface AccordionProps {
  /** Compound usage: `<Accordion.Item>` children. */
  children?: ReactNode
  /** Data-driven shortcut, rendered as `<Accordion.Item>`s before any children. */
  items?: AccordionItem[]
}

export function Accordion({ children, items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId(current => (current === id ? null : id))

  return (
    <AccordionContext value={{ openId, toggle }}>
      <div>
        {items?.map(item => (
          <AccordionItemView key={item.id} id={item.id} title={item.title}>
            {item.content}
          </AccordionItemView>
        ))}
        {children}
      </div>
    </AccordionContext>
  )
}

Accordion.Item = AccordionItemView
