import { useNavigate } from 'react-router-dom'
import Header from '../layout/Header'
import Breadcrumbs from '../ui/Breadcrumbs'
import CartItem from './CartItem'
import CartItemSkeleton from './CartItemSkeleton'
import Button from '../ui/Button'
import StateMessage from '../ui/StateMessage'
import { useCart } from '../../contexts/CartContext'

function Cart() {
  const {
    cartItems,
    isCartLoading: isLoading,
    cartError: error,
    refetchCart: onRetry,
    updateQuantity: onUpdateQuantity,
    removeFromCart: onRemoveCartItem,
    updatingProductId,
  } = useCart()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemSubtotal, 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Dynamic calculations for Shipping and Tax
  const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 150) : 0; // Free shipping over ₹10,000, else ₹150
  const taxRate = 0.08; // 8% tax rate to match your design
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + shipping + tax;

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
              <div className="flex flex-col gap-4 text-gray-700 text-sm mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} items):</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>{formatINR(tax)}</span>
                </div>
              </div>

              <hr className="border-[#ff6b00] my-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl text-gray-800">Total:</span>
                <span className="font-bold text-2xl text-[#ff6b00]">
                  {formatINR(finalTotal)}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <Button variant="primary" className="w-full" onClick={() => navigate('/checkout2')}>
                  PROCEED TO CHECKOUT
                </Button>
                <Button
                  variant="secondary"
                  className="w-full bg-[#1a1a1a] text-white hover:bg-black"
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
      <Header />

      <main className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[50vh]">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Shopping Cart' }]} />

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Shopping Cart {(!isLoading && !error && cartItems.length > 0) ? `(${totalQuantity} Items)` : ''}
        </h1>

        {content}
      </main>
    </>
  )
}

export default Cart
