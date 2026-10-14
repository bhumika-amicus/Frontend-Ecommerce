import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { CartItemDto } from '../../types/CartDto'
import placeholderImg from '../../assets/placeholder.jpg'
import QuantitySelector from './QuantitySelector'
import { formatINR } from '../../utils/formatters'

interface CartItemProps {
  item: CartItemDto
  onQuantityChange: (productId: number, quantity: number) => Promise<boolean> | void
  onRemove: (productId: number) => void
  isUpdating?: boolean
}

function CartItem({ item, onQuantityChange, onRemove, isUpdating: externalIsUpdating = false }: CartItemProps) {
  const [localIsUpdating, setLocalIsUpdating] = useState(false)
  const isUpdating = externalIsUpdating || localIsUpdating

  const handleQuantityChange = React.useCallback(async (newQuantity: number) => {
    if (newQuantity === item.quantity || isUpdating) return

    if (newQuantity === 0) {
      setLocalIsUpdating(true)
      try {
        await onRemove(item.productId)
      } finally {
        setLocalIsUpdating(false)
      }
      return
    }

    setLocalIsUpdating(true)
    try {
      await onQuantityChange(item.productId, newQuantity)
    } finally {
      setLocalIsUpdating(false)
    }
  }, [item.productId, item.quantity, isUpdating, onQuantityChange, onRemove])

  const handleRemove = React.useCallback(async () => {
    if (isUpdating) return
    setLocalIsUpdating(true)
    try {
      await onRemove(item.productId)
    } finally {
      setLocalIsUpdating(false)
    }
  }, [isUpdating, onRemove, item.productId])

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
            className={`text-sm self-start hover:underline inline-flex items-center gap-1.5 transition-colors ${isUpdating ? 'text-gray-400 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
            onClick={handleRemove}
            disabled={isUpdating}
          >
            <Trash2 size={14} />
            <span>Remove</span>
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
            onQuantityChange={handleQuantityChange}
            disabled={isUpdating}
            minQuantity={0}
          />
        </div>
      </div>

      {/* Total */}
      <div className="w-full md:w-32 flex justify-between md:justify-end items-center">
        <span className="md:hidden text-gray-500 text-sm font-bold">Total</span>
        <span className="font-bold text-brand-orange text-lg">{formatINR(item.itemSubtotal)}</span>
      </div>
    </div>
  )
}

export default React.memo(CartItem)
