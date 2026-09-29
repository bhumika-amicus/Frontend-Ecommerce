import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'
import Assignment5 from './pages/Assignment5'
import Checkout from './pages/checkout1'
import Checkout2 from './pages/Checkout2'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment3" element={<Assignment3 />} />
        <Route path="/assignment5" element={<Assignment5 />} />
        <Route path="/Checkout1" element={<Checkout/> }/>
        <Route path="/checkout2" element={<Checkout2/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App