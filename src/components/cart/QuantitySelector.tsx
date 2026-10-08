import { useState, useEffect } from 'react'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  disabled?: boolean
  minQuantity?: number
}

function QuantitySelector({
  quantity,
  onQuantityChange,
  disabled = false,
  minQuantity = 1,
}: QuantitySelectorProps) {
  const [inputValue, setInputValue] = useState(String(quantity))

  useEffect(() => {
    setInputValue(String(quantity))
  }, [quantity])

  const handleInputChange = (value: string) => {
    if (disabled) return

    if (value === '') {
      setInputValue('')
      return
    }

    const nextQuantity = Number(value)

    if (!Number.isInteger(nextQuantity) || nextQuantity < minQuantity) {
      setInputValue(String(minQuantity))
      onQuantityChange(minQuantity)
      return
    }

    setInputValue(value)
    onQuantityChange(nextQuantity)
  }

  const handleInputBlur = () => {
    if (disabled) return

    // If  left blank, safely bounce back to 1.
  
    if (inputValue === '') {
      const fallback = Math.max(1, minQuantity)
      setInputValue(String(fallback))
      onQuantityChange(fallback)
    } else {
      // Just in case they typed something invalid like '1.5' or '-'
      let finalQuantity = Number(inputValue)
      if (!Number.isInteger(finalQuantity) || finalQuantity < minQuantity) {
        setInputValue(String(minQuantity))
        onQuantityChange(minQuantity)
      }
    }
  }

  const handleQuantityStep = (step: number) => {
    if (disabled) return

    const nextQuantity = Math.max(minQuantity, quantity + step)
    setInputValue(String(nextQuantity))
    onQuantityChange(nextQuantity)
  }

  return (
    <div className="col-span-full row-start-2 mx-auto inline-flex w-full max-w-47.5 items-center justify-center gap-4.5">
      <span className="text-sm font-bold text-[#555555]">
        QTY:
      </span>

      <div className="inline-flex items-center overflow-hidden rounded border border-[#e5e5e5] bg-white">
        <button
          type="button"
          disabled={quantity <= minQuantity || disabled}
          onClick={() => handleQuantityStep(-1)}
          aria-label="Decrease quantity"
          className="h-7 w-7 border-0 bg-[#fff4ef] p-0 text-lg font-bold leading-none text-brand-orange transition-colors duration-200 hover:bg-brand-orange hover:text-white focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:text-[#b8b8b8]"
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
          disabled={disabled}
          className="h-7 w-10.5 border-0 border-x border-[#f1f1f1] bg-white px-1 text-center text-sm font-bold leading-7 text-[#333333] focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:bg-gray-50 disabled:text-gray-400 [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleQuantityStep(1)}
          aria-label="Increase quantity"
          className="h-7 w-7 border-0 bg-[#fff4ef] p-0 text-lg font-bold leading-none text-brand-orange transition-colors duration-200 hover:bg-brand-orange hover:text-white focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:text-[#b8b8b8]"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector