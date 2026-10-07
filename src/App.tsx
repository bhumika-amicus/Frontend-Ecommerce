import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'
import ProductListing from './pages/ProductListing'
import Cart from './components/Cart'
import Checkout from './pages/Checkout1'
import Checkout2 from './pages/Checkout2'
import { initializeAuth } from './services/auth'
import { getCart, addCartItem, updateCartItem, removeCartItem } from './services/cartApi'
import type { CartItemDto } from './types/CartDto'
import type { Product } from './types/Products'

function App() {
  const [cartItems, setCartItems] = useState<CartItemDto[]>([])
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [cartError, setCartError] = useState<string | null>(null)
  const [cartRefreshCount, setCartRefreshCount] = useState(0)
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    setIsCartLoading(true)
    setCartError(null)

    // Ensure dev login completes BEFORE attempting to load the cart
    initializeAuth()
      .then(() => getCart(controller.signal))
      .then(setCartItems)
      .catch((error) => {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        console.error('Failed to load cart:', error)
        setCartError(error instanceof Error ? error.message : 'Unable to load cart. Please try again.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsCartLoading(false)
        }
      })

    return () => controller.abort()
  }, [cartRefreshCount])

  const handleAddToCart = async (product: Product, quantity: number) => {
    try {
      await addCartItem(product.id, quantity)

      const updatedCart = await getCart()
      setCartItems(updatedCart)
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    setUpdatingProductId(productId)
    try {
      await updateCartItem(productId, quantity)
      
      const updatedCart = await getCart()
      setCartItems(updatedCart)
    } catch (error) {
      console.error('Failed to update cart item quantity:', error)
    } finally {
      setUpdatingProductId(null)
    }
  }

  const handleRemoveCartItem = async (productId: number) => {
    setUpdatingProductId(productId)
    try {
      await removeCartItem(productId)

      const updatedCart = await getCart()
      setCartItems(updatedCart)
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    } finally {
      setUpdatingProductId(null)
    }
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home onAddToCart={handleAddToCart} cartCount={cartCount} />} />
        <Route path="/assignment3" element={<Assignment3 />} />
        <Route path="/products" element={<ProductListing onAddToCart={handleAddToCart} cartCount={cartCount} />} />
        <Route path="/cart" element={
          <Cart 
            cartItems={cartItems} 
            isLoading={isCartLoading} 
            error={cartError}
            onRetry={() => setCartRefreshCount(prev => prev + 1)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveCartItem={handleRemoveCartItem}
            updatingProductId={updatingProductId}
          />
        } />
        <Route path="/checkout1" element={<Checkout/> }/>
        <Route path="/checkout2" element={<Checkout2/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App