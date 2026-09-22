import { useState } from 'react'
import './QuantitySelector.css'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
}

function QuantitySelector({
  quantity,
  onQuantityChange,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(String(quantity))

  const handleInputChange = (value: string) => {
    if (value === '') {
      setInputValue('')
      return
    }

    const nextQuantity = Number(value)

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      setInputValue('1')
      onQuantityChange(1)
      return
    }

    setInputValue(value)
    onQuantityChange(nextQuantity)
  }

  const handleInputBlur = () => {
    if (inputValue === '' || !Number.isInteger(Number(inputValue))) {
      setInputValue('1')
      onQuantityChange(1)
    }
  }

  const handleQuantityStep = (step: number) => {
    const nextQuantity = Math.max(1, quantity + step)
    setInputValue(String(nextQuantity))
    onQuantityChange(nextQuantity)
  }

  return (
    <div className="quantity-selector">
      <span className="quantity-label">QTY:</span>

      <div className="quantity-controls">
        <button
          type="button"
          disabled={quantity === 1}
          onClick={() => handleQuantityStep(-1)}
          aria-label="Decrease quantity"
        >
          -
        </button>

        <input
          type="number"
          min="1"
          step="1"
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onBlur={handleInputBlur}
          aria-label="Quantity"
        />

        <button
          type="button"
          onClick={() => handleQuantityStep(1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector