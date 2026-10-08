import React, { useState, useEffect } from 'react'
import type { CartItemDto } from '../../types/CartDto'
import placeholderImg from '../../assets/placeholder.jpg'
import QuantitySelector from './QuantitySelector'

interface CartItemProps {
  item: CartItemDto
  onQuantityChange: (productId: number, quantity: number) => Promise<boolean> | void
  onRemove: (productId: number) => void
  isUpdating: boolean
}

function CartItem({ item, onQuantityChange, onRemove, isUpdating }: CartItemProps) {

  const [localQuantity, setLocalQuantity] = useState(item.quantity)
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Keep local UI in sync if the server data updates from somewhere else
  useEffect(() => {
    setLocalQuantity(item.quantity)
  }, [item.quantity])

  // 2. A single, clean function to handle typing
  const handleQuantityChange = React.useCallback((newQuantity: number) => {
    setLocalQuantity(newQuantity) // Update text box instantly

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Wait 600ms of silence before doing anything
    debounceTimer.current = setTimeout(async () => {
      if (newQuantity === 0) {
        onRemove(item.productId)
      } else if (newQuantity !== item.quantity) {
        // Await the API call. If it returns false (failed), revert the text box!
        const success = await onQuantityChange(item.productId, newQuantity)
        if (success === false) {
          setLocalQuantity(item.quantity)
        }
      }
    }, 600)
  }, [item.productId, item.quantity, onQuantityChange, onRemove])

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
            quantity={localQuantity}
            onQuantityChange={handleQuantityChange}
            disabled={isUpdating}
            minQuantity={0}
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
