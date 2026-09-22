import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './FeaturedProductCarousel.css'

import type { Product } from '../types/Products'
import ProductCard from './ProductCard'

interface FeaturedProductCarouselProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

function FeaturedProductCarousel({
  products,
  onAddToCart,
}: FeaturedProductCarouselProps) {
  return (
    <section className="featured-products">
      <div className="section-heading">
        <h2>Featured Parts</h2>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default FeaturedProductCarousel