import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomToaster from './components/ui/CustomToaster'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'
import ProductListing from './pages/ProductListing'
import Cart from './components/cart/Cart'
import Checkout from './pages/Checkout1'
import Checkout2 from './pages/Checkout2'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <CartProvider>
      <CustomToaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assignment3" element={<Assignment3 />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout1" element={<Checkout/> }/>
          <Route path="/checkout2" element={<Checkout2 /> }/>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App