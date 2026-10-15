import Button from '../common/Button'
import { formatINR } from '../../utils/formatters'

export interface CartOrderSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  finalTotal: number
  cartCount: number
  onCheckout: () => void
  onContinueShopping: () => void
}

function CartOrderSummary({
  subtotal,
  shipping,
  tax,
  finalTotal,
  cartCount,
  onCheckout,
  onContinueShopping,
}: CartOrderSummaryProps) {
  return (
    <div className="w-full lg:w-80 xl:w-96 self-start lg:sticky lg:top-6">
      <div className="border border-gray-200 bg-white shadow-sm">
        <div className="bg-gray-900 text-white font-bold py-3 px-6 tracking-wider">
          ORDER SUMMARY
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 text-gray-700 text-sm mb-6">
            <div className="flex justify-between">
              <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
              <span>{formatINR(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated Shipping (Standard):</span>
              <span>{formatINR(shipping)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax (18%):</span>
              <span>{formatINR(tax)}</span>
            </div>
          </div>

          <hr className="border-brand-orange my-6" />

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-xl text-gray-800">Total:</span>
            <span className="font-bold text-2xl text-brand-orange">
              {formatINR(finalTotal)}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full" onClick={onCheckout}>
              PROCEED TO CHECKOUT
            </Button>
            <Button
              variant="secondary"
              className="w-full bg-gray-900 text-white hover:bg-black"
              onClick={onContinueShopping}
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartOrderSummary
