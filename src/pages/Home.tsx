import { useEffect, useState } from 'react'
import './Home.css'
import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import Footer from '../components/Footer'
import type { Product } from '../types/Products'
import FeaturedProductCarousel from '../components/FeaturedProductCarousel'
import ShopByCategory from '../components/ShopByCategory'
import ServiceHighlights from '../components/ServiceHighlights'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import { getProducts } from '../services/api'

function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshCount, setRefreshCount] = useState(0)

  const fetchProducts = async (signal?: AbortSignal) => {
    setIsLoading(true)
    setError(null)

    try {
      const transformedProducts = await getProducts(signal)

      setProducts(transformedProducts)
      setIsLoading(false)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      console.error("API Error:", error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller.signal)

    return () => {
      controller.abort()
    }
  }, [refreshCount])

  const handleAddToCart = (product: Product) => {
    console.log(`Added product ${product.id}: ${product.name}`)
  }

  return (
    <>
      <Header />

      <Hero />

      <main>
        <CategoryGrid />

        {isLoading ? (
          <section className="products-section skeleton-carousel-section">
            <div className="skeleton-carousel-track">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton-carousel-slide">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="products-section empty-state empty-state-section">
            <p className="error-message">{error}</p>
            <button className="button button-outline" onClick={() => setRefreshCount(prev => prev + 1)}>
              Try Again
            </button>
          </section>
        ) : products.length === 0 ? (
          <section className="products-section empty-state empty-state-section">
            <h2>No products available.</h2>
            <p>The store is currently empty. Please check back later!</p>
          </section>
        ) : (
          <>
            <section id="products" className="products-section">
              <FeaturedProductCarousel
                products={products}
                onAddToCart={handleAddToCart}
              />
            </section>
            <ShopByCategory products={products} />
          </>
        )}

        <ServiceHighlights />
      </main>

      <Footer />
    </>
  )
}

export default Home
