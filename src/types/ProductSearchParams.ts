export interface ProductSearchParams {
  search?: string
  categoryId?: number
  brandId?: number
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: string
  sortOrder?: string
  page?: number
  pageSize?: number
}