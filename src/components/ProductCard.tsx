import { useState } from 'react'
import type { Product } from '../types/Products'
import Button from './Button'
import Card from './Card'
import QuantitySelector from './QuantitySelector'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  const formattedTotalPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price * quantity)

  const rating = product.rating
  const fullStars = rating !== undefined ? Math.floor(rating) : 0
  const emptyStars = 5 - fullStars

  const isSale = product.discountPercentage ? product.discountPercentage > 0 : false;

  let isNew = false
  if (product.createdAt) {
    const createdDate = new Date(product.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    isNew = createdDate > thirtyDaysAgo;
  }

  return (
    <Card variant="elevated">
      <div className="product-image-container">
        <div className="badge-container">
          {isSale && <span className="badge badge-sale">SALE</span>}
          {isNew && <span className="badge badge-new">NEW</span>}
        </div>
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
              {'★'.repeat(fullStars)}

              <span className="empty-stars">
                {'★'.repeat(emptyStars)}
              </span>
            </span>

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            <span className="rating-value">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <p className="product-price">
          {formattedTotalPrice}
        </p>

        <Button
          variant="primary"
          onClick={() => onAddToCart(product)}
        >
          ADD TO CART
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard