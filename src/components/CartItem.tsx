import type { CartItemDto } from '../types/CartDto'
import placeholderImg from '../assets/placeholder.jpg'
import QuantitySelector from './QuantitySelector'

interface CartItemProps {
  item: CartItemDto
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  isUpdating: boolean
}

function CartItem({ item, onQuantityChange, onRemove, isUpdating }: CartItemProps) {
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4">
      {/* Product Info */}
      <div className="flex items-center flex-1 w-full gap-4">
        <img
          src={placeholderImg}
          alt={item.productName}
          className="h-24 w-24 object-cover bg-gray-50 border border-gray-200"
        />
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg mb-2">{item.productName}</span>
          <button
            type="button"
            className={`text-sm self-start hover:underline ${isUpdating ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'}`}
            onClick={() => onRemove(item.productId)}
            disabled={isUpdating}
          >
            Remove
          </button>
        </div>
      </div>

      {/* Unit Price */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Unit Price</span>
        <span className="text-gray-800 text-lg">{formatINR(item.price)}</span>
      </div>

      {/* Quantity */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Qty</span>
        <div>
          <QuantitySelector 
            quantity={item.quantity} 
            onQuantityChange={(quantity) => onQuantityChange(item.productId, quantity)} 
            disabled={isUpdating}
          />
        </div>
      </div>

      {/* Total */}
      <div className="w-full md:w-32 flex justify-between md:justify-end items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Total</span>
        <span className="font-bold text-[#ff6b00] text-lg">{formatINR(item.itemSubtotal)}</span>
      </div>
    </div>
  )
}

export default CartItem
