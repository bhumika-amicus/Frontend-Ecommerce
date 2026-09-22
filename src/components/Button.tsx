import type { ReactNode } from 'react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'

interface ButtonProps {
  variant?: ButtonVariant
  children: ReactNode
  disabled?: boolean
  onClick?: () => void
  className?: string
}

function Button({  variant = 'primary',  children,  disabled = false, onClick, className = '' }: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button-${variant} ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button