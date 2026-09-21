import type { ReactNode } from 'react'

type CardVariant = 'elevated' | 'bordered' | 'flat'

interface CardProps {
  variant?: CardVariant
  children: ReactNode
}

function Card({ variant = 'elevated', children }: CardProps) {
  return (
    <div className={`card card-${variant}`}>
      {children}
    </div>
  )
}

export default Card