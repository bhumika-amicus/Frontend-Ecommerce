export interface DummyProduct {
  id: number
  title: string
  price: number
  category: string
  rating: number
  thumbnail: string
}

export interface DummyProductResponse {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}