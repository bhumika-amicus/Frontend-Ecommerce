import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import CartItem from '../components/cart/CartItem'
import CartSkeleton from '../components/cart/CartSkeleton'
import CartOrderSummary from '../components/cart/CartOrderSummary'
import StateMessage from '../components/ui/StateMessage'
import { useCart } from '../hooks/useCart'
import { usePageMeta } from '../hooks/usePageMeta'
import { shippingRates, ShippingMethod } from '../types/OrderDto'

function Cart() {
  usePageMeta(
    'Shopping Cart',
    'Review your cart items, quantities, subtotal, and proceed to secure checkout on Trendify.'
  )

  const {
    cartItems,
    cartCount,
    isCartLoading: isLoading,
    cartError: error,
    refetchCart: onRetry,
    updateQuantity: onUpdateQuantity,
    removeFromCart: onRemoveCartItem,
  } = useCart()
  const navigate = useNavigate()

  const { subtotal, shipping, tax, finalTotal } = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.itemSubtotal ?? item.price * item.quantity),
      0
    )
    const shipping = subtotal > 0 ? shippingRates[ShippingMethod.Standard] : 0
    const tax = subtotal * 0.18
    const finalTotal = subtotal + shipping + tax
    return { subtotal, shipping, tax, finalTotal }
  }, [cartItems])

  let content;

  if (isLoading) {
    content = <CartSkeleton />
  } else if (error) {
    content = (
      <StateMessage
        title="Unable to load cart"
        message={error}
        buttonText="Try Again"
        onAction={onRetry}
        className="py-12"
      />
    )
  } else if (cartItems.length === 0) {
    content = (
      <StateMessage
        title="Your Cart is Empty"
        message="Looks like you haven't added anything to your cart yet."
        buttonText="Continue Shopping"
        onAction={() => navigate('/products')}
        className="py-12"
      />
    )
  } else {
    content = (
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1">
          {/* Desktop Table Header */}
          <div className="hidden md:flex bg-gray-900 text-white font-bold py-3 px-4 mb-2 gap-4">
            <div className="flex-1">Product</div>
            <div className="w-32 text-center">Unit Price</div>
            <div className="w-32 text-center">Qty</div>
            <div className="w-32 text-right">Total</div>
          </div>

          <div className="flex flex-col border-t border-gray-200 md:border-t-0">
            {cartItems.map((item) => (
              <CartItem 
                key={item.productId} 
                item={item} 
                onQuantityChange={onUpdateQuantity} 
                onRemove={onRemoveCartItem} 
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <CartOrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          finalTotal={finalTotal}
          cartCount={cartCount}
          onCheckout={() => navigate('/checkout')}
          onContinueShopping={() => navigate('/products')}
        />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[50vh]">
      <Breadcrumbs />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        Shopping Cart {(!isLoading && !error && cartItems.length > 0) ? `(${cartCount} ${cartCount === 1 ? 'Item' : 'Items'})` : ''}
      </h1>

      {content}
    </div>
  )
}

export default Cart
