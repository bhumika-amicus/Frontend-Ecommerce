import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import Footer from '../components/Footer'
import type { Product } from '../types/Products'
import FeaturedProductCarousel from '../components/FeaturedProductCarousel'
import ShopByCategory from '../components/ShopByCategory'
import ServiceHighlights from '../components/ServiceHighlights'
import { products } from '../data/products'

function Home() {
  const handleAddToCart = (product: Product) => {
    console.log(`Added product ${product.id}: ${product.name}`)
  }

  return (
    <>
      <Header />

      <Hero />

      <main>
        <CategoryGrid />

        <section  id="products" className="products-section" >
         <FeaturedProductCarousel
            products={products}
            onAddToCart={handleAddToCart}
          />
        </section>

        <ShopByCategory products={products} />
        <ServiceHighlights />
      </main>

      <Footer />
    </>
  )
}

export default Home
