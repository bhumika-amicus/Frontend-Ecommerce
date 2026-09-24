import { useEffect, useState } from 'react'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import './Assignment5.css'
import type { DummyProduct, DummyProductResponse } from '../types/DummyProduct'

function transformProduct(product: DummyProduct): Product {
  return {
    id: product.id,
    name: product.title,
    price: product.price,
    imageUrl: product.thumbnail,
    category: product.category,
    rating: product.rating,
  }
}

function Assignment5() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const fetchProducts = async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        'https://dummyjson.com/products',
        { signal }
      )

      if (!response.ok) {
        console.error(`API HTTP Error: ${response.status} ${response.statusText}`)
        if (response.status === 404) {
          throw new Error('We could not find the products you are looking for.')
        }
        throw new Error('We are having trouble loading the products right now. Please try again.')
      }

      const data: DummyProductResponse = await response.json()
      const transformedProducts = data.products.map(transformProduct)

      setProducts(transformedProducts)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      console.error("API Error:", error)

      setError(error instanceof Error ? error.message : 'An unexpected error occurred.'
      )

      setIsLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    console.log('Fetching products from API...')
    fetchProducts(controller.signal)

    return () => {
      controller.abort()
    }
  }, [])

  const productCategories = [...new Set(products.map((product) => product.category)),]

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

  if (isLoading) {
    return (
      <main className="product-listing">
        <div className="product-listing-header">
          <h1>Product Listing</h1>
        </div>
        <div className="product-listing-content">
          <aside className="filter-sidebar">
            <h2>CATEGORIES</h2>
            <div className="empty-state" style={{ padding: '20px' }}>Loading...</div>
          </aside>
          <section className="product-listing-products">
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </section>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="product-listing">
        <div className="product-listing-header">
          <h1>Product Listing</h1>
        </div>
        <div className="empty-state">
          <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>
          <button className="button button-primary" onClick={() => fetchProducts()}>
            Refresh
          </button>
        </div>
      </main>
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

      {products.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <h2>No products available.</h2>
          <p>The store is currently empty. Please check back later!</p>
        </div>
      ) : (
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
      )}
    </main>
  )
}

export default Assignment5