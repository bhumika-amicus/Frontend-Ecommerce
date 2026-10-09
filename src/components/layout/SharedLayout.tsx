import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
    <span className="text-gray-500 font-medium tracking-wide text-sm uppercase">Loading</span>
  </div>
)

export default function SharedLayout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
