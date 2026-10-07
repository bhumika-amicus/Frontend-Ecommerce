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

interface HomeProps {
  onAddToCart: (product: Product, quantity: number) => void;
  cartCount: number;
}

function Home({ onAddToCart, cartCount }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)

  const [productsRefreshCount, setProductsRefreshCount] = useState(0)
  const [categoriesRefreshCount, setCategoriesRefreshCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getProducts(signal)

        if (signal.aborted) return

        setProducts(data)
      } catch (error) {
        if (signal.aborted) return

        console.error('API Error:', error)
        setError(
          error instanceof Error
            ? error.message
            : 'Unable to load products. Please try again.'
        )
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => {
      controller.abort()
    }
  }, [productsRefreshCount])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function loadCategories() {
      setIsCategoriesLoading(true)
      setCategoriesError(null)

      try {
        const data = await getCategories(signal)

        if (signal.aborted) return

        setCategories(data)
      } catch (error) {
        if (signal.aborted) return

        console.error('Category API Error:', error)
        setCategoriesError(
          error instanceof Error
            ? error.message
            : 'Unable to load categories. Please try again.'
        )
      } finally {
        if (!signal.aborted) {
          setIsCategoriesLoading(false)
        }
      }
    }

    void loadCategories()

    return () => {
      controller.abort()
    }
  }, [categoriesRefreshCount])

  return (
    <>
      <Header cartCount={cartCount} />

      <Hero />

      <main>
        <CategoryGrid />

        {isLoading ? (
          <section
            className="overflow-hidden px-5 py-16"
            aria-label="Loading featured products"
            aria-busy="true"
          >
            <div className="flex justify-center gap-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="w-70 shrink-0">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          </section>
        ) : error ? (
          <section className="px-5 py-16 text-center" role="alert">
            <p className="mb-4 text-red-600">{error}</p>

            <button
              type="button"
              className="button button-outline"
              onClick={() => setProductsRefreshCount(prev => prev + 1)}
            >
              Try Again
            </button>
          </section>
        ) : products.length === 0 ? (
          <section className="px-5 py-16 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">
              No products available.
            </h2>
            <p>The store is currently empty. Please check back later!</p>
          </section>
        ) : (
          <section id="products" className="py-16">
            <FeaturedProductCarousel
              products={products}
              onAddToCart={onAddToCart}
            />
          </section>
        )}

        <ShopByCategory
          categories={categories}
          isLoading={isCategoriesLoading}
          error={categoriesError}
          onRetry={() => setCategoriesRefreshCount(prev => prev + 1)}
        />

        <ServiceHighlights />
      </main>

      <Footer />
    </>
  )
}

export default Home
