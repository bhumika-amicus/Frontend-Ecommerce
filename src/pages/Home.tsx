import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import Footer from '../components/Footer'
import type { Product } from '../types/Products'
import FeaturedProductCarousel from '../components/FeaturedProductCarousel'
import ShopByCategory from '../components/ShopByCategory'
import ServiceHighlights from '../components/ServiceHighlights'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import type { Category } from '../types/Categories'
import { getCategories, getProducts } from '../services/api'

function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
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

  const fetchCategories = async (signal?: AbortSignal) => {
    try {
      const data = await getCategories(signal)
      setCategories(data)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }

      console.error('Category API Error:', error)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchProducts(controller.signal)
    fetchCategories(controller.signal)

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
          <section className="overflow-hidden px-5 py-16">
            <div className="flex justify-center gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="w-70 shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="px-5 py-16 text-center">
            <p className="mb-4 text-red-600">{error}</p>

            <button
              className="button button-outline"
              onClick={() => setRefreshCount(prev => prev + 1)}
            >
              Try Again
            </button>
          </section>
        ) : products.length === 0 ? (
          <section className="px-5 py-16 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">No products available.</h2>
            <p>The store is currently empty. Please check back later!</p>
          </section>
        ) : (
          <>
            <section id="products" className="py-16">
              <FeaturedProductCarousel
                products={products}
                onAddToCart={handleAddToCart}
              />
            </section>
            <ShopByCategory categories={categories} />
          </>
        )}

        <ServiceHighlights />
      </main>

      <Footer />
    </>
  )
}

export default Home
