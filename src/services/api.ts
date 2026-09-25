import { transformProduct } from '../utils/apiUtils'
import type { DummyProductResponse } from '../types/DummyProduct'
import type { Product } from '../types/Products'

const BASE_URL = 'https://dummyjson.com';

async function apiFetch<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, { signal });

  if (!response.ok) {
    console.error(`API HTTP Error: ${response.status} ${response.statusText}`);

    if (response.status === 404) {
      throw new Error('We could not find the products you are looking for.');
    }

    throw new Error('We are having trouble loading the products right now. Please try again.');
  }

  return response.json();
}

export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const data = await apiFetch<DummyProductResponse>('/products', signal);

  return data.products.map(transformProduct);
}
