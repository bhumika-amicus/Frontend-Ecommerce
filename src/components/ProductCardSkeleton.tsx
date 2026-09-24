import './ProductCardSkeleton.css'
import Card from './Card'

function ProductCardSkeleton() {
  return (
    <Card variant="elevated">
      <div className="skeleton-image-container skeleton-pulse"></div>

      <div className="product-info">
        <div className="skeleton-title skeleton-pulse"></div>
        
        <div className="product-rating">
          <div className="skeleton-stars skeleton-pulse"></div>
        </div>

        <div className="skeleton-price skeleton-pulse"></div>

        <div className="skeleton-button skeleton-pulse"></div>
      </div>
    </Card>
  )
}

export default ProductCardSkeleton
