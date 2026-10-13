import { useState, memo } from 'react'
import { Star, StarHalf } from 'lucide-react'
import type { Product } from '../../types/Products'
import Button from '../ui/Button'
import Card from '../ui/Card'
import QuantitySelector from '../cart/QuantitySelector'
import placeholderImg from '../../assets/placeholder.jpg'

import { useCartActions } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { formatINR } from '../../utils/formatters'

interface ProductCardProps {
  product: Product
}

function ProductCard({
  product,
}: ProductCardProps) {
  const { addToCart } = useCartActions()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product, quantity);
      setQuantity(1);
    } finally {
      setIsAdding(false);
    }
  }

  const formattedTotalPrice = formatINR(product.price * quantity)

  // const isSale = product.discountPercentage ? product.discountPercentage > 10 : false;

  // let formattedOldPrice = null;
  // if (isSale && product.discountPercentage) {
  //   const originalUnitPrice = product.price / (1 - (product.discountPercentage / 100));
  //   formattedOldPrice = new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //   }).format(originalUnitPrice * quantity);
  // }

  const rating = product.rating
  const fullStars = rating !== undefined ? Math.floor(rating) : 0
  const hasHalfStar = rating !== undefined ? (rating - fullStars) >= 0.5 : false
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  // let isNew = false;
  // if (product.createdAt) {
  //   const createdDate = new Date(product.createdAt);
  //   const twelveMonthsAgo = new Date();
  //   twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  //   isNew = createdDate > twelveMonthsAgo;
  // }

  return (
    <Card variant="elevated" className="transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.02] motion-reduce:transition-none">
      <Link to={`/products/${product.id}`} className="relative flex h-40 w-full items-center justify-center border-b border-[#f1f1f1] bg-white max-[650px]:h-48 group">
        <img
          src={placeholderImg}
          alt={product.name}
          className="block h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col px-4 py-3 text-center">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h2 className="m-0 mb-1.5 line-clamp-2 min-h-10 overflow-hidden text-base leading-[1.3] font-bold uppercase text-brand-orange">
            {product.name}
          </h2>
        </Link>

        {rating !== undefined && (
          <div className="mb-3 grid grid-cols-[auto_auto] grid-rows-[auto_auto] items-center justify-center gap-x-2 gap-y-2">
            <span className="col-start-1 row-start-1 flex items-center text-brand-orange">
              {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
              ))}
              {hasHalfStar && (
                <StarHalf className="h-4 w-4 fill-current" />
              )}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
              ))}
            </span>

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />

            <span className="col-start-2 row-start-1 text-sm font-semibold text-[#555555]">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <div className="mb-3 flex items-baseline justify-center gap-1 whitespace-nowrap">
          {/* {formattedOldPrice && ( */}
          <span className="text-base font-bold text-brand-orange">{formattedTotalPrice}</span>
          {/* )} */}
          {/* <span className="text-base font-bold text-brand-orange">{formattedTotalPrice}</span>
          {isSale && product.discountPercentage && (
            <span className="text-[11px] font-bold text-[#388e3c]">
              ({Math.round(product.discountPercentage)}% off)
            </span>
          )} */}
        </div>

        <Button
          variant="primary"
          className="mt-auto w-full px-3! py-2! text-sm!"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'ADDING...' : 'ADD TO CART'}
        </Button>
      </div>
    </Card>
  )
}

export default memo(ProductCard)