import { createContext, useContext } from 'react';
import type {
  OrderSummaryItemDto,
  OrderDetailDto,
  OrderFilterTab,
} from '../types/OrderDto';

export interface OrderContextType {
  orders: OrderSummaryItemDto[];
  filteredOrders: OrderSummaryItemDto[];
  isLoading: boolean;
  error: string | null;
  activeTab: OrderFilterTab;
  setActiveTab: (tab: OrderFilterTab) => void;
  orderDetailsCache: Record<number, OrderDetailDto>;
  fetchOrders: () => Promise<void>;
  getOrderDetail: (orderId: number) => Promise<OrderDetailDto | null>;
  reorder: (orderId: number) => Promise<boolean>;
  reorderingId: number | null;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
