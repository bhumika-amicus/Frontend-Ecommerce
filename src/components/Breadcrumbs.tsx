import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex items-center gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={item.label} className="flex items-center gap-3">
              {item.path ? (
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
