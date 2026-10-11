import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Star, StarHalf } from 'lucide-react'
import { getProductById } from '../services/productApi'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import type { Product } from '../types/Products'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import placeholderImg from '../assets/placeholder.jpg'
import toast from 'react-hot-toast'

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
})

const formatINR = (amount: number) => inrFormatter.format(amount)

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { addToCart, addingProductId } = useCart()
  const { isLoggedIn } = useAuth()
  const isAdding = addingProductId === product?.id

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const data = await getProductById(Number(id))
        if (data) {
          setProduct(data)
        } else {
          setError('Product not found')
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err)
        setError('Failed to fetch product details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    if (!isLoggedIn) {
      toast.error('Please log in to add items to your cart.')
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    addToCart(product, 1)
  }

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center font-bold text-gray-500">Loading product...</div>
  }

  if (error || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center font-bold text-red-500">
        {error || 'Product not found'}
        <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>Return to Products</Button>
      </div>
    )
  }

  const fullStars = product.rating !== undefined ? Math.floor(product.rating) : 0
  const hasHalfStar = product.rating !== undefined ? (product.rating - fullStars) >= 0.5 : false
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
      <Breadcrumbs />

      <Card variant="elevated" className="mt-6 p-6 sm:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16">
          <div className="flex flex-1 items-center justify-center rounded border border-gray-100 bg-[#f9f9f9] p-8 md:p-12">
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
              <div className="mb-6 flex items-center text-brand-orange">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <Star key={`full-${i}`} className="h-5 w-5 fill-current" />
                ))}
                {hasHalfStar && <StarHalf className="h-5 w-5 fill-current" />}
                {Array.from({ length: emptyStars }).map((_, i) => (
                  <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
                ))}
                <span className="ml-2 font-bold text-[#555]">{product.rating.toFixed(1)} / 5</span>
              </div>
            )}

            <p className="mb-6 text-3xl font-bold text-gray-900">
              {formatINR(product.price)}
            </p>

            <hr className="mb-6 border-gray-200" />

            <h3 className="mb-2 font-bold text-gray-900">Product Description</h3>
            <p className="mb-8 text-gray-600 leading-relaxed">
              {product.description || "No description available for this product."}
            </p>

            <Button
              variant="primary"
              className="w-full px-10 py-3 text-base md:w-auto self-start"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? 'ADDING TO CART...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProductDetail
