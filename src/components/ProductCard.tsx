import type { Product } from '../types/Products'
import Button from './Button'
import Card from './Card'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price)

    const rating = product.rating
    const fullStars = rating !== undefined? Math.floor(rating): 0
    const emptyStars = 5 - fullStars

  return (
    <Card variant="elevated">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h2 className="product-name">
          {product.name}
        </h2>

        {rating !== undefined && (
            <div className="product-rating">
                <span className="stars">
                {"★".repeat(fullStars)}
                <span className="empty-stars">
                    {"★".repeat(emptyStars)}
                </span>
                </span>

                <span className="rating-value">
                {rating.toFixed(1)}
                </span>
            </div>
        )}

        <p className="product-price">
          {formattedPrice}
        </p>

        <Button variant="primary" onClick={() => onAddToCart(product)}>
          ADD TO CART
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard