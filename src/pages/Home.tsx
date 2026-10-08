import Header from '../components/layout/Header'
import Hero from '../components/layout/Hero'
import CategoryGrid from '../components/product/CategoryGrid'
import Footer from '../components/layout/Footer'
import FeaturedProductCarousel from '../components/product/FeaturedProductCarousel'
import ShopByCategory from '../components/product/ShopByCategory'
import ServiceHighlights from '../components/layout/ServiceHighlights'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton'
import { getCategories, getProducts } from '../services/productApi'
import { useFetch } from '../hooks/useFetch'


function Home() {
  const {
    data: productsData,
    isLoading,
    error,
    refetch: refetchProducts,
  } = useFetch(getProducts)

  const products = productsData || []

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useFetch(getCategories)

  const categories = categoriesData || []

  return (
    <>
      <Header />

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
              onClick={() => refetchProducts()}
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
            />
          </section>
        )}

        <ShopByCategory
          categories={categories}
          isLoading={isCategoriesLoading}
          error={categoriesError}
          onRetry={() => refetchCategories()}
        />

        <ServiceHighlights />
      </main>

      <Footer />
    </>
  )
}

export default Home
