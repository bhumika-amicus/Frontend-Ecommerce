export const ShippingMethod = {
  Standard: 'standard',
  Express: 'express',
  SameDay: 'same day',
} as const;

export type ShippingMethod = (typeof ShippingMethod)[keyof typeof ShippingMethod];

export const PaymentMethod = {
  Cod: 'cod',
  Card: 'card',
  Upi: 'upi',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const OrderStatus = {
  Pending: 'Pending',
  Placed: 'Placed',
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type FormShippingMethod = '' | ShippingMethod;

export interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  shippingMethod: FormShippingMethod;
  paymentMethod: PaymentMethod;
}

export const initialShippingFormData: ShippingFormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  country: '',
  state: '',
  city: '',
  postalCode: '',
  isDefault: true,
  shippingMethod: '',
  paymentMethod: PaymentMethod.Cod,
};

export const shippingRates: Record<ShippingMethod, number> = {
  [ShippingMethod.Standard]: 100,
  [ShippingMethod.Express]: 250,
  [ShippingMethod.SameDay]: 400,
};

export { formatINR } from '../utils/formatters';

export interface AddressDto {
  addressId: number;
  customerId?: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressRequest {
  addressId?: number;
  customerId?: number;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateAddressRequest {
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressResponse {
  addressId: number;
  message?: string;
}

export interface CheckoutRequest {
  addressId: number;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  priceChanges: unknown[];
  stockIssues: unknown[];
  orderId: number | null;
}

export interface MockPaymentRequest {
  orderId: number;
  paymentMethod: PaymentMethod;
}

export interface MockPaymentResponse {
  orderId: number;
  paymentStatus: 'Success' | 'Failed';
  transactionReference: string;
  amount: number;
}

export interface OrderItemDetail {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  itemSubtotal: number;
}

export interface OrderShippingDetail {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingMethod: string;
  shippingCharge: number;
}

export interface OrderPaymentDetail {
  paymentId: number;
  orderId: number;
  paymentStatus: string;
  paymentMethod: string | null;
  amount: number;
  transactionReference: string;
  createdAt: string;
}

export interface OrderDetailDto {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: OrderStatus | string;
  createdAt: string;
  items: OrderItemDetail[];
  shipping: OrderShippingDetail;
  payment: OrderPaymentDetail | null;
}

export const OrderFilterTab = {
  All: 'All Orders',
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
} as const;

export type OrderFilterTab = (typeof OrderFilterTab)[keyof typeof OrderFilterTab];

export interface OrderSummaryItemDto {
  orderId: number;
  customerId: number;
  subtotal: number;
  shippingCharge: number;
  tax: number;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  createdBy?: number;
  updatedAt?: string | null;
  updatedBy?: number | null;
}

export interface OrderHistoryResponse {
  orders: OrderSummaryItemDto[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

