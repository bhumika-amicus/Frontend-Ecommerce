import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import ErrorBoundary from '../common/ErrorBoundary'

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
    <span className="text-gray-500 font-medium tracking-wide text-sm uppercase">Loading</span>
  </div>
)

export default function SharedLayout() {
  const location = useLocation()

  return (
    <>
      <Header />
      <main>
        <ErrorBoundary key={location.pathname}>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
