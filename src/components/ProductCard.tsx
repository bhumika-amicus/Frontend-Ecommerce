import { useState } from 'react'
import type { Product } from '../types/Products'
import Button from './Button'
import Card from './Card'
import QuantitySelector from './QuantitySelector'

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
  const emptyStars = 5 - fullStars

  // let isNew = false;
  // if (product.createdAt) {
  //   const createdDate = new Date(product.createdAt);
  //   const twelveMonthsAgo = new Date();
  //   twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  //   isNew = createdDate > twelveMonthsAgo;
  // }

  return (
    <Card variant="elevated" className="transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.02] motion-reduce:transition-none">
      <div className="relative flex h-40 w-full items-center justify-center border-b border-[#f1f1f1] bg-white max-[650px]:h-48">
        {/* <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {isSale && <span className="w-max rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-red-600 uppercase">SALE</span>}
          {isNew && <span className="w-max rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">NEW</span>}
        </div> */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="block h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col px-4 py-3 text-center">
        <h2 className="m-0 mb-1.5 line-clamp-2 min-h-10 overflow-hidden text-base leading-[1.3] font-bold uppercase text-brand-orange">
          {product.name}
        </h2>

        {rating !== undefined && (
          <div className="mb-3 grid grid-cols-[auto_auto] grid-rows-[auto_auto] items-center justify-center gap-x-2 gap-y-2">
            <span className="col-start-1 row-start-1 text-sm text-brand-orange">
              {'★'.repeat(fullStars)}

              <span className="text-gray-300">
                {'★'.repeat(emptyStars)}
              </span>
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
          onClick={() => onAddToCart(product)}
        >
          ADD TO CART
        </Button>
      </div>
    </Card>
  )
}

export default ProductCard