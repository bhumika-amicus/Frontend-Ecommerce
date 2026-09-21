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
}

function Button({  variant = 'primary',  children,  disabled = false, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button