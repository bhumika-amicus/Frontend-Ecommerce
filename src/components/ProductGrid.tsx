import ProductCard from './ProductCard'
import type { Product } from '../types/Products'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

function ProductGrid({
  products,
  onAddToCart,
}: ProductGridProps) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

export default ProductGrid