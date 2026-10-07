import { apiFetch } from './api';
import type { CartItemDto, AddCartItemRequest, UpdateCartItemRequest } from '../types/CartDto';

export async function getCart(signal?: AbortSignal): Promise<CartItemDto[]> {
  const data = await apiFetch<CartItemDto[]>('/api/v1/cart', {
    auth: true,
    signal,
  });
  return data ?? [];
}

export async function addCartItem(productId: number, quantity: number, signal?: AbortSignal): Promise<CartItemDto> {
  const payload: AddCartItemRequest = { productId, quantity };
  const data = await apiFetch<CartItemDto>('/api/v1/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    auth: true,
    signal,
  });
  if (!data) throw new Error('Expected data from addCartItem but got none');
  return data;
}

export async function updateCartItem(productId: number, quantity: number, signal?: AbortSignal): Promise<void> {
  const payload: UpdateCartItemRequest = { quantity };
  await apiFetch<void>(`/api/v1/cart/items/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    auth: true,
    signal,
  });
}

export async function removeCartItem(productId: number, signal?: AbortSignal): Promise<void> {
  await apiFetch<void>(`/api/v1/cart/items/${productId}`, {
    method: 'DELETE',
    auth: true,
    signal,
  });
}

export async function clearCart(signal?: AbortSignal): Promise<void> {
  await apiFetch<void>('/api/v1/cart', {
    method: 'DELETE',
    auth: true,
    signal,
  });
}
