import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomToaster from './components/common/CustomToaster'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import NotFound from './pages/NotFound'
import SharedLayout from './components/layout/SharedLayout'
import ScrollToTop from './components/layout/ScrollToTop'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { OrderProvider } from './contexts/OrderContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'

const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Orders = lazy(() => import('./pages/Orders'))

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <CustomToaster />
          <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<SharedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App