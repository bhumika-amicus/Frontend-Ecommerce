import type { ReactNode } from 'react'

type CardVariant = 'elevated' | 'bordered' | 'flat'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
  className?: string
}

function Card({ variant = 'elevated', children, className = '' }: CardProps) {
  return (
    <div className={`card card-${variant} ${className}`.trim()}>
      {children}
    </div>
  )
}

export default Card