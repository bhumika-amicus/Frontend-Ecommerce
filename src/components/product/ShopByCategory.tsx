import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import type { Category } from '../../types/Categories'

interface ShopByCategoryProps {
  categories: Category[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

function ShopByCategory({
  categories,
  isLoading,
  error,
  onRetry,
}: ShopByCategoryProps) {
  return (
    <section className="mx-auto max-w-350 px-12 pt-5 pb-15">
      <div className="section-heading">
        <h2>Shop by Category</h2>
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          aria-label="Loading categories"
          aria-busy="true"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="py-6 text-center" role="alert">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            type="button"
            className="button button-outline"
            onClick={onRetry}
          >
            Try Again
          </button>
        </div>
      ) : categories.length === 0 ? (
        <p className="py-6 text-center text-gray-600">
          No categories available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products?categoryId=${category.id}`}
              className="no-underline"
            >
              <Card
                variant="bordered"
                className="cursor-pointer items-center justify-center px-5 py-4 text-center transition duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.05)]"
              >
                <h3 className="m-0 text-sm font-semibold tracking-normal text-brand-orange">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default ShopByCategory