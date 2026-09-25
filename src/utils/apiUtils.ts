import type { DummyProduct } from '../types/DummyProduct'
import type { Product } from '../types/Products'

export function transformProduct(product: DummyProduct): Product {
  return {
    id: product.id,
    name: product.title,
    price: product.price,
    imageUrl: product.thumbnail,
    category: product.category,
    rating: product.rating,
    discountPercentage: product.discountPercentage,
    createdAt: product.meta?.createdAt,
  }
}
