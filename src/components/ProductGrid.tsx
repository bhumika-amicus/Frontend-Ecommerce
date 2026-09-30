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
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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