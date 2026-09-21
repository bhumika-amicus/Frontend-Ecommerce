interface QuantitySelectorProps {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
}

function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div>
      <button
        disabled={quantity === 1}
        onClick={onDecrease}
      >
        -
      </button>

      <span>{quantity}</span>

      <button onClick={onIncrease}>
        +
      </button>
    </div>
  )
}

export default QuantitySelector