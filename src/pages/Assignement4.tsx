import ProductCard from '../components/ProductCard'
import type { Product } from '../types/Products'

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
    <ProductCard
      product={product}
      onAddToCart={handleAddToCart}
    />
  )
}

export default Assignment4