import { useState } from 'react'

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
    <div className="col-span-full row-start-2 mx-auto inline-flex w-full max-w-47.5 items-center justify-center gap-4.5">
      <span className="text-sm font-bold text-[#555555]">
        QTY:
      </span>

      <div className="inline-flex items-center overflow-hidden rounded border border-[#e5e5e5] bg-white">
        <button
          type="button"
          disabled={quantity === 1}
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
          className="h-7 w-10.5 border-0 border-x border-[#f1f1f1] bg-white px-1 text-center text-sm font-bold leading-7 text-[#333333] focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:-outline-offset-2 [appearance:textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
        />

        <button
          type="button"
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