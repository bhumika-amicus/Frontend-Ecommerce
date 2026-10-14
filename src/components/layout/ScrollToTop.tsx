import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets the window scroll position to the top whenever
 * the route pathname changes (client-side navigation).
 * Must be rendered inside <BrowserRouter>.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
