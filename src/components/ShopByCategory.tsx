import Card from './Card'
import type { Product } from '../types/Products'

interface ShopByCategoryProps {
  products: Product[]
}

function ShopByCategory({ products }: ShopByCategoryProps) {
  // Option A: Dynamically extract unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <section className="shop-by-category-section">
      <div className="section-heading">
        <h2>Part Categories</h2>
      </div>

      <div className="category-list-grid">
        {categories.map((category) => (
          <Card key={category} variant="bordered" className="category-list-card">
            <h3 className="category-list-title">{category}</h3>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default ShopByCategory
