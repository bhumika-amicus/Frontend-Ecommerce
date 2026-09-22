import ProductCard from '../components/ProductCard'
import type { Product } from '../types/Products'
import './Assignment4.css'

function Assignment4() {
  const product: Product = {
    id: 1,
    name: 'Wireless Headphones',
    price: 2499,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    rating: 4.5,
  }

  const handleAddToCart = (product: Product) => {
    console.log(`Added product ${product.id}: ${product.name}`)
  }

  return (
    <div className="assignment4-page">
      <div className="assignment4-product-wrapper">
        <ProductCard
          product={product}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  )
}

export default Assignment4