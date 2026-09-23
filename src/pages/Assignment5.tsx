import { useState } from 'react'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'
import { productCategories, products } from '../data/products'
import './Assignment5.css'

function Assignment5() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const filteredProducts =
    selectedCategories.length === 0
      ? products
      : products.filter((product) => selectedCategories.includes(product.category))

  const activeCategoryLabel =
    selectedCategories.length === 0
      ? 'All categories'
      : selectedCategories.join(', ')

  const handleAddToCart = (product: Product) => {
    console.log(`Added product ${product.id}: ${product.name}`)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((previousCategories) =>
      previousCategories.includes(category)
        ? previousCategories.filter((item) => item !== category)
        : [...previousCategories, category]
    )
  }

  return (
    <main className="product-listing">
      <div className="product-listing-header">
        <h1>Product Listing</h1>
        <p className="product-listing-filter-summary">
          Filtering by: {activeCategoryLabel}
        </p>
      </div>

      <div className="product-listing-content">
        <aside className="filter-sidebar">
          <h2>CATEGORIES</h2>
          <section className="filter-section">
            <label>
              <input
                type="checkbox"
                checked={selectedCategories.length === 0}
                onChange={() => setSelectedCategories([])}
              />
              All
            </label>

            {productCategories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </section>
        </aside>

        <section className="product-listing-products">
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <p className="empty-state">
              No products found in this category.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}

export default Assignment5