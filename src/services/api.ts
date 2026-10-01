import { transformCategory, transformProduct } from '../utils/apiUtils'
import type { ProductDto } from '../types/ProductDto'
import type { Product } from '../types/Products'
import type { CategoryDto } from '../types/CategoryDto';
import type { Category } from '../types/Categories';
import type { ProductSearchParams } from '../types/ProductSearchParams'
import type { ProductSearchResultDto } from '../types/ProductSearchResult'

const BASE_URL =  'https://training-ecom1-a9a2cmbsefdvgwha.centralindia-01.azurewebsites.net';


async function apiFetch<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { signal });

  if (!response.ok) {
    console.error(
      `API HTTP Error: ${response.status} ${response.statusText}`
    )

    if (response.status === 404) {
      throw new Error('The requested resource could not be found.')
    }

    if (response.status >= 500) {
      throw new Error(
        'The server is currently unavailable. Please try again later.'
      )
    }

    throw new Error(
      'We are having trouble completing your request. Please try again.'
    )
  }

  return response.json()
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await apiFetch<ProductDto[]>('/api/v1/Products', signal);

  return data.map(transformProduct);
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const data = await apiFetch<CategoryDto[]>('/api/Categories?api-version=1', signal)

  return data.map(transformCategory)
}

export async function searchProducts( params: ProductSearchParams, signal?: AbortSignal): Promise<ProductSearchResultDto> {
  const queryParams = new URLSearchParams()

  if (params.search) {
    queryParams.set('Search', params.search)
  }

  if (params.categoryId !== undefined) {
    queryParams.set('CategoryId', String(params.categoryId))
  }

  if (params.brandId !== undefined) {
    queryParams.set('BrandId', String(params.brandId))
  }

  if (params.minPrice !== undefined) {
    queryParams.set('MinPrice', String(params.minPrice))
  }

  if (params.maxPrice !== undefined) {
    queryParams.set('MaxPrice', String(params.maxPrice))
  }

  if (params.minRating !== undefined) {
    queryParams.set('MinRating', String(params.minRating))
  }

  if (params.sortBy) {
    queryParams.set('SortBy', params.sortBy)
  }

  if (params.sortOrder) {
    queryParams.set('SortOrder', params.sortOrder)
  }

  if (params.page !== undefined) {
    queryParams.set('Page', String(params.page))
  }

  if (params.pageSize !== undefined) {
    queryParams.set('PageSize', String(params.pageSize))
  }

  const data = await apiFetch<ProductSearchResultDto>(`/api/v1/Products/search?${queryParams.toString()}`, signal )

  return data
}