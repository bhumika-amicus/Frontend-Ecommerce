import './QuantitySelector.css'

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
    <div className="quantity-selector">
      <span className="quantity-label">QTY:</span>

      <div className="quantity-controls">
        <button disabled={quantity === 1} onClick={onDecrease}>
        -
        </button>

        <span>{quantity}</span>

        <button onClick={onIncrease}>+</button>
      </div>
    </div>
  )
}

export default QuantitySelector