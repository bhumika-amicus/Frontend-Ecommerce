import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'
import Assignment5 from './pages/Assignment5'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment3" element={<Assignment3 />} />
        <Route path="/assignment5" element={<Assignment5 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App