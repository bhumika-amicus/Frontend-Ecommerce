import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  <section className="w-full px-11 max-[650px]:px-4.5 [&_.swiper-pagination-bullet-active]:bg-[#555555]!">
      <div className="section-heading">
        <h2>Featured Products</h2>
      </div>

      <div className="relative">
        <button
          type="button"
          className="absolute top-1/2 -left-9 z-2 grid h-8 w-8 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover max-[650px]:-left-1"
          aria-label="Previous featured part"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ChevronLeft
            aria-hidden="true"
            className="h-7.5 w-7.5"
          />
        </button>

        <Swiper
          className="overflow-hidden! pb-10!"
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
          className="absolute top-1/2 -right-9 z-2 grid h-8 w-8 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover max-[650px]:-right-1"
          aria-label="Next featured part"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ChevronRight
            aria-hidden="true"
            className="h-7.5 w-7.5"
          />
        </button>
      </div>
    </section>
  )
}

export default FeaturedProductCarousel