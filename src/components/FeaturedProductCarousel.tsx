import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const swiperRef = useRef<SwiperInstance | null>(null)

  return (
    <section className="featured-products">
      <div className="section-heading">
        <h2>Featured Parts</h2>
      </div>

      <div className="featured-products-carousel">
        <button
          type="button"
          className="featured-products-prev"
          aria-label="Previous featured part"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <Swiper
          modules={[Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
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

        <button
          type="button"
          className="featured-products-next"
          aria-label="Next featured part"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

export default FeaturedProductCarousel