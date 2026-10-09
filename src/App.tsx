import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomToaster from './components/ui/CustomToaster'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import SharedLayout from './components/layout/SharedLayout'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Login from './pages/Login'

const Checkout = lazy(() => import('./pages/Checkout'))
const Assignment9 = lazy(() => import('./pages/Assignment9'))
const Orders = lazy(() => import('./pages/Orders'))
const Assignment3 = lazy(() => import('./pages/Assignment3'))

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CustomToaster />
        <BrowserRouter>
          <Routes>
            <Route element={<SharedLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
              
              {/* Assignment Routes */}
              <Route path="/assignment9" element={<Assignment9 />} />
              <Route path="/assignment3" element={<Assignment3 />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App