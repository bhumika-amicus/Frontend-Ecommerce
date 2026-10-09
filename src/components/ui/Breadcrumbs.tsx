import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  path?: string
}

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Home' }],
  '/products': [{ label: 'Home', path: '/' }, { label: 'Products' }],
  '/cart': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart' }],
  '/assignment9': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }],
  '/checkout': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }],
  '/orders': [{ label: 'Home', path: '/' }, { label: 'Orders' }]
}

function Breadcrumbs() {
  const location = useLocation()
  const pathname = location.pathname.endsWith('/') && location.pathname !== '/'
    ? location.pathname.slice(0, -1)
    : location.pathname

  let items = routeMapping[pathname]

  if (!items && pathname.startsWith('/products/')) {
    const productId = pathname.split('/')[2]
    if (productId) {
      items = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: `Product ${productId}` }
      ]
    }
  }

  if (!items) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex items-center gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={item.label} className="flex items-center gap-3">
              {item.path && !isLast ? (
                <Link 
                  to={item.path} 
                  className="font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-gray-600">
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span aria-hidden="true" className="text-gray-400">
                  <ChevronRight size={16} />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
