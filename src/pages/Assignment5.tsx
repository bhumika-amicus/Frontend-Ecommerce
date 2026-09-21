import { useState } from 'react'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'

const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 2499,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 3499,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    rating: 4.3,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 2999,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Footwear',
    rating: 4.6,
  },
  {
    id: 4,
    name: 'Leather Backpack',
    price: 1599,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    rating: 4.2,
  },
  {
    id: 5,
    name: 'Wireless Keyboard',
    price: 1299,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'Electronics',
    rating: 4.4,
  },
  {
    id: 6,
    name: 'Classic Sunglasses',
    price: 999,
    imageUrl:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    category: 'Accessories',
    rating: 4.1,
  },
  {
    id: 7,
    name: 'Casual T-Shirt',
    price: 799,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Clothing',
    rating: 4.3,
  },
  {
    id: 8,
    name: 'Travel Water Bottle',
    price: 599,
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Lifestyle',
    rating: 4.5,
  },
]

function Assignment5() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(
          product => product.category === selectedCategory
        )

  const handleAddToCart = (product: Product) => {
    console.log(`Added product ${product.id}: ${product.name}`)
  }

  return (
    <main className="product-listing">
      <div className="product-listing-header">
        <h1>Product Listing</h1>
      </div>

      <div className="product-listing-content">
        <aside className="filter-sidebar">
          <h2>CATEGORIES</h2>

          <section className="filter-section">
            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'All'}
                onChange={() => setSelectedCategory('All')}
              />
              All
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'Electronics'}
                onChange={() => setSelectedCategory('Electronics')}
              />
              Electronics
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'Clothing'}
                onChange={() => setSelectedCategory('Clothing')}
              />
              Clothing
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'Footwear'}
                onChange={() => setSelectedCategory('Footwear')}
              />
              Footwear
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'Accessories'}
                onChange={() => setSelectedCategory('Accessories')}
              />
              Accessories
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedCategory === 'Lifestyle'}
                onChange={() => setSelectedCategory('Lifestyle')}
              />
              Lifestyle
            </label>
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