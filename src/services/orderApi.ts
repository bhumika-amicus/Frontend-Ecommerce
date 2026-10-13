import { apiFetch } from './api';
import type {
  AddressDto,
  CreateAddressRequest,
  CreateAddressResponse,
  UpdateAddressRequest,
  CheckoutRequest,
  CheckoutResponse,
  MockPaymentRequest,
  MockPaymentResponse,
  OrderDetailDto,
  OrderHistoryResponse,
  PaymentMethod,
} from '../types/OrderDto';

export async function getAddresses(
  signal?: AbortSignal
): Promise<AddressDto[]> {
  const data = await apiFetch<AddressDto[]>('/api/v1/addresses', {
    auth: true,
    signal,
  });
  return data || [];
}

export async function createAddress(
  address: CreateAddressRequest,
  signal?: AbortSignal
): Promise<CreateAddressResponse> {
  const data = await apiFetch<CreateAddressResponse>('/api/v1/addresses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
    auth: true,
    signal,
  });
  if (!data) throw new Error('Failed to create address');
  return data;
}

export async function updateAddress(
  addressId: number,
  address: UpdateAddressRequest,
  signal?: AbortSignal
): Promise<void> {
  await apiFetch<void>(`/api/v1/addresses/${addressId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
    auth: true,
    signal,
  });
}

export async function deleteAddress(
  addressId: number,
  signal?: AbortSignal
): Promise<void> {
  await apiFetch<void>(`/api/v1/addresses/${addressId}`, {
    method: 'DELETE',
    auth: true,
    signal,
  });
}

export async function createCheckout(
  checkoutData: CheckoutRequest,
  signal?: AbortSignal
): Promise<CheckoutResponse> {
  const data = await apiFetch<CheckoutResponse>('/api/v1/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(checkoutData),
    auth: true,
    signal,
  });
  if (!data) throw new Error('Failed to create checkout order');
  return data;
}

export async function processMockPayment(
  orderId: number,
  paymentMethod: PaymentMethod,
  signal?: AbortSignal
): Promise<MockPaymentResponse> {
  const payload: MockPaymentRequest = { orderId, paymentMethod };
  const data = await apiFetch<MockPaymentResponse>('/api/payments/mock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    auth: true,
    signal,
  });
  if (!data) throw new Error('Failed to process payment');
  return data;
}

export async function getOrderById(
  orderId: number,
  signal?: AbortSignal
): Promise<OrderDetailDto> {
  const data = await apiFetch<OrderDetailDto>(`/api/v1/orders/${orderId}`, {
    auth: true,
    signal,
  });
  if (!data) throw new Error(`Order #${orderId} not found`);
  return data;
}

export async function reorderOrder(
  orderId: number,
  signal?: AbortSignal
): Promise<{ message: string }> {
  const data = await apiFetch<{ message: string }>(
    `/api/v1/orders/${orderId}/reorder`,
    {
      method: 'POST',
      auth: true,
      signal,
    }
  );
  if (!data) throw new Error('Failed to reorder items');
  return data;
}

export async function getOrderHistory(
  params?: { status?: string; page?: number; pageSize?: number },
  signal?: AbortSignal
): Promise<OrderHistoryResponse> {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.pageSize) query.append('pageSize', params.pageSize.toString());

  const queryString = query.toString();
  const endpoint = `/api/v1/orders/history${queryString ? `?${queryString}` : ''}`;
  const data = await apiFetch<OrderHistoryResponse>(endpoint, {
    auth: true,
    signal,
  });
  return data || { orders: [], page: 1, pageSize: 10, totalRecords: 0, totalPages: 0 };
}
