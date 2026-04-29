import { Eyebrow } from '@/components/storefront/Typography'

interface SectionLabelProps {
  children: React.ReactNode
  color?: string
}

export function SectionLabel({ children, color = 'var(--color-bark-muted)' }: SectionLabelProps) {
  return <Eyebrow style={{ color }}>{children}</Eyebrow>
}
