import type { ReactNode } from 'react'

type CardVariant = 'elevated' | 'bordered' | 'flat'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  elevated: 'bg-white shadow-elevated',
  bordered: 'border border-border-subtle bg-white',
  flat: 'bg-surface-muted',
}

function Card({ variant = 'elevated', children, className = '' }: CardProps) {
  return (
    <div className={`rounded flex flex-col h-full overflow-hidden ${variantStyles[variant]} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card