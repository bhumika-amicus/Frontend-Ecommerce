import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  path?: string
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/': [{ label: 'Home' }],
  '/products': [{ label: 'Home', path: '/' }, { label: 'Products' }],
  '/cart': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart' }],
  '/assignment9': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }],
  '/checkout': [{ label: 'Home', path: '/' }, { label: 'Shopping Cart', path: '/cart' }, { label: 'Checkout' }],
  '/orders': [{ label: 'Home', path: '/' }, { label: 'My Orders' }],
}

function Breadcrumbs({ items: customItems }: BreadcrumbsProps = {}) {
  const location = useLocation()
  const pathname = location.pathname.endsWith('/') && location.pathname !== '/'
    ? location.pathname.slice(0, -1)
    : location.pathname

  let items = customItems || routeMapping[pathname]

  if (!items && pathname.startsWith('/products/')) {
    const productId = pathname.split('/')[2]
    if (productId) {
      items = [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: `Product ${productId}` },
      ]
    }
  }

  if (!items || items.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 sm:gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2 sm:gap-3">
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="font-semibold text-brand-orange hover:text-brand-orange-hover transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={`text-gray-600 ${isLast ? 'truncate max-w-50 sm:max-w-md' : ''}`}
                  title={isLast ? item.label : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span aria-hidden="true" className="text-gray-400 shrink-0">
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
