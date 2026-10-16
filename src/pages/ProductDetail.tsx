import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getProductById } from '../services/productApi'
import { useCartActions } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { usePageMeta } from '../hooks/usePageMeta'
import type { Product } from '../types/Products'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Breadcrumbs from '../components/common/Breadcrumbs'
import StateMessage from '../components/common/StateMessage'
import RatingStars from '../components/common/RatingStars'
import QuantitySelector from '../components/cart/QuantitySelector'
import ProductDetailSkeleton from '../components/product/ProductDetailSkeleton'
import placeholderImg from '../assets/placeholder.jpg'
import toast from 'react-hot-toast'
import { formatINR } from '../utils/formatters'
import NotFound from './NotFound'

interface ProductDetailContentProps {
  product: Product
}

function ProductDetailContent({ product }: ProductDetailContentProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCartActions()
  const { isLoggedIn } = useAuth()

  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (isAdding) return

    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart.')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setIsAdding(true)
    try {
      await addToCart(product, quantity)
      setQuantity(1)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Products', path: '/products' },
          { label: product.name },
        ]}
      />

      <Card variant="elevated" className="mt-6 p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="flex flex-1 items-center justify-center rounded border border-gray-100 bg-surface-muted p-8 md:p-12">
            <img
              src={placeholderImg}
              alt={product.name}
              className="max-h-100 w-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <span className="mb-2 text-sm font-bold tracking-wider text-brand-orange uppercase">
              {product.category}
            </span>

            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className="mb-4 text-gray-500">
              Brand: {product.brand}
            </p>

            {product.rating !== undefined && (
              <RatingStars
                rating={product.rating}
                size="md"
                scoreFormat="fraction"
                className="mb-6"
              />
            )}

            <p className="mb-6 text-3xl font-bold text-gray-900">
              {formatINR(product.price)}
            </p>

            <hr className="mb-6 border-gray-200" />

            <h3 className="mb-2 font-bold text-gray-900">Product Description</h3>
            <p className="mb-8 text-gray-600 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                disabled={isAdding}
                className="!mx-0"
              />

              <Button
                variant="primary"
                className="w-full px-10 py-3 text-base sm:w-auto"
                onClick={handleAddToCart}
                disabled={isAdding}
              >
                {isAdding ? 'ADDING TO CART...' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const productId = Number(id)
  const isValidId = !Number.isNaN(productId) && productId > 0

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useFetch<Product | null>(
    async (signal) => {
      if (!isValidId) return null
      const data = await getProductById(productId, signal)
      return data ?? null
    },
    [productId, isValidId],
    { skip: !isValidId }
  )

  usePageMeta(
    product?.name,
    product
      ? `Buy ${product.name} at Trendify for ${formatINR(product.price)}. Fast shipping and guaranteed authenticity.`
      : undefined
  )

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-8 sm:px-5 md:px-8">
        <StateMessage
          title="Unable to load product"
          message={error}
          className="py-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="primary" onClick={refetch}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate('/products')}>
              Return to Products
            </Button>
          </div>
        </StateMessage>
      </div>
    )
  }

  if (!isValidId || !product) {
    return (
      <NotFound
        title="Product Not Found"
        message="Oops! The product you are looking for doesn't exist, has been removed, or is temporarily unavailable."
      />
    )
  }

  return <ProductDetailContent key={product.id} product={product} />
}

export default ProductDetail
