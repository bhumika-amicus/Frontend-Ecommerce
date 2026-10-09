import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function SharedLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
