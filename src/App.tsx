import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomToaster from './components/ui/CustomToaster'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import Cart from './components/cart/Cart'
import NotFound from './pages/NotFound'
import SharedLayout from './components/layout/SharedLayout'
import { CartProvider } from './contexts/CartContext'

const Checkout = lazy(() => import('./pages/Checkout'))
const Assignment9 = lazy(() => import('./pages/Assignment9'))
const Orders = lazy(() => import('./pages/Orders'))
const Assignment3 = lazy(() => import('./pages/Assignment3'))

function App() {
  return (
    <CartProvider>
      <CustomToaster />
      <BrowserRouter>
        <Routes>
          <Route element={<SharedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/assignment9" element={<Assignment9 />} />
            <Route path="/assignment3" element={<Assignment3 />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App