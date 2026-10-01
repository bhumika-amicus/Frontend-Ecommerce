import { Link } from 'react-router-dom'
import Card from './Card'
import type { Category } from '../types/Categories'

interface ShopByCategoryProps {
  categories: Category[]
}

function ShopByCategory({ categories }: ShopByCategoryProps) {
  return (
    <section className="mx-auto max-w-350 px-12 pt-5 pb-15">
      <div className="section-heading">
        <h2>Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
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
    </section>
  )
}

export default ShopByCategory