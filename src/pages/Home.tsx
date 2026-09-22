import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryGrid from '../components/CategoryGrid'
import Footer from '../components/Footer'
import type { Product } from '../types/Products'
import FeaturedProductCarousel from '../components/FeaturedProductCarousel'
import ShopByCategory from '../components/ShopByCategory'
import ServiceHighlights from '../components/ServiceHighlights'

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
  }
]

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
