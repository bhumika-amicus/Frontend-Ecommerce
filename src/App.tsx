import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'
import ProductListing from './pages/ProductListing'
import Checkout from './pages/Checkout1'
import Checkout2 from './pages/Checkout2'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment3" element={<Assignment3 />} />
        <Route path="/products" element={<ProductListing/>} />
        <Route path="/checkout1" element={<Checkout/> }/>
        <Route path="/checkout2" element={<Checkout2/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App