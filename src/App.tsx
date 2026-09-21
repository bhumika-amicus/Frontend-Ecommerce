import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Assignment3 from './pages/Assignment3'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment3" element={<Assignment3 />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App