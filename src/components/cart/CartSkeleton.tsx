import CartItemSkeleton from './CartItemSkeleton'
import CartSummarySkeleton from './CartSummarySkeleton'

export default function CartSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Table & Cart Items Skeleton */}
      <div className="flex-1">
        <div className="hidden md:flex bg-gray-900 text-white font-bold py-3 px-4 mb-2 gap-4">
          <div className="flex-1">Product</div>
          <div className="w-32 text-center">Unit Price</div>
          <div className="w-32 text-center">Qty</div>
          <div className="w-32 text-right">Total</div>
        </div>
        <div className="flex flex-col border-t border-gray-200 md:border-t-0">
          <CartItemSkeleton />
          <CartItemSkeleton />
          <CartItemSkeleton />
        </div>
      </div>

      {/* Order Summary Skeleton */}
      <CartSummarySkeleton />
    </div>
  )
}
