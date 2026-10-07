import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import Header from './Header'
import CartItem from './CartItem'
import CartItemSkeleton from './CartItemSkeleton'
import Button from './Button'
import StateMessage from './StateMessage'
import type { CartItemDto } from '../types/CartDto'

interface CartProps {
  cartItems: CartItemDto[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemoveCartItem: (productId: number) => void
  updatingProductId: number | null
}

function Cart({ cartItems, isLoading, error, onRetry, onUpdateQuantity, onRemoveCartItem, updatingProductId }: CartProps) {
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemSubtotal, 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  let content;

  if (isLoading) {
    content = (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="hidden md:flex bg-[#1a1a1a] text-white font-bold py-3 px-4 mb-2">
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
        <div className="w-full lg:w-80 xl:w-96 animate-pulse">
          <div className="border border-gray-200 bg-gray-50 h-72"></div>
        </div>
      </div>
    )
  } else if (error) {
    content = (
      <div className="flex justify-center items-center py-12">
        <StateMessage
          title="Unable to load cart"
          message={error}
          buttonText="Try Again"
          onAction={onRetry}
        />
      </div>
    )
  } else if (cartItems.length === 0) {
    content = (
      <div className="flex justify-center items-center py-12">
        <StateMessage
          title="Your Cart is Empty"
          message="Looks like you haven't added anything to your cart yet."
          buttonText="Continue Shopping"
          onAction={() => navigate('/products')}
        />
      </div>
    )
  } else {
    content = (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1">
          {/* Desktop Table Header */}
          <div className="hidden md:flex bg-[#1a1a1a] text-white font-bold py-3 px-4 mb-2">
            <div className="flex-1">Product</div>
            <div className="w-32 text-center">Unit Price</div>
            <div className="w-32 text-center">Qty</div>
            <div className="w-32 text-right">Total</div>
          </div>

          <div className="flex flex-col border-t border-gray-200 md:border-t-0">
            {cartItems.map((item) => (
              <CartItem 
                key={item.cartItemId} 
                item={item} 
                onQuantityChange={onUpdateQuantity} 
                onRemove={onRemoveCartItem} 
                isUpdating={updatingProductId === item.productId}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 xl:w-96">
          <div className="border border-gray-200 bg-white shadow-sm">
            <div className="bg-[#1a1a1a] text-white font-bold py-3 px-6 tracking-wider">
              ORDER SUMMARY
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-4 text-gray-700">
                <span>Subtotal ({totalQuantity} items):</span>
                <span>{formatINR(subtotal)}</span>
              </div>

              <hr className="border-gray-200 my-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl text-gray-800">Total:</span>
                <span className="font-bold text-2xl text-[#ff6b00]">
                  {formatINR(subtotal)}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <Button variant="primary" className="w-full">
                  PROCEED TO CHECKOUT
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/products')}
                >
                  CONTINUE SHOPPING
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header cartCount={totalQuantity} />

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[50vh]">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <ol className="flex items-center gap-3">
            <li>
              <Link to="/" className="font-semibold text-brand-orange hover:text-[#e65c00]">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-400">
              <ChevronRight size={16} />
            </li>
            <li aria-current="page" className="text-gray-600">
              Shopping Cart
            </li>
          </ol>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Shopping Cart {(!isLoading && !error && cartItems.length > 0) ? `(${totalQuantity} Items)` : ''}
        </h1>

        {content}
      </main>
    </>
  )
}

export default Cart
