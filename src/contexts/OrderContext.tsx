import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getOrderHistory, getOrderById } from '../services/orderApi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { OrderContext } from '../hooks/useOrders';
import {
  type OrderSummaryItemDto,
  type OrderDetailDto,
  type OrderFilterTab,
  OrderFilterTab as FilterTabs,
} from '../types/OrderDto';

const EMPTY_ORDERS: OrderSummaryItemDto[] = [];

export function OrderProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn, user } = useAuth();
  const { addToCart } = useCart();

  const [orderDetailsCache, setOrderDetailsCache] = useState<Record<number, OrderDetailDto>>({});
  const [activeTab, setActiveTab] = useState<OrderFilterTab>(FilterTabs.All);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const requestKey = `${user?.email ?? 'anonymous'}:${activeTab}:${refreshCount}`;
  const [orderResult, setOrderResult] = useState<{
    requestKey: string;
    orders: OrderSummaryItemDto[];
    error: string | null;
  } | null>(null);

  const orders = isLoggedIn && orderResult?.requestKey === requestKey
    ? orderResult.orders
    : EMPTY_ORDERS;
  const error = isLoggedIn && orderResult?.requestKey === requestKey
    ? orderResult.error
    : null;
  const isLoading = isLoggedIn && orderResult?.requestKey !== requestKey;

  // Fetch full details of a specific order by ID (with caching)
  const getOrderDetail = useCallback(
    async (orderId: number): Promise<OrderDetailDto | null> => {
      if (orderDetailsCache[orderId]) {
        return orderDetailsCache[orderId];
      }

      try {
        const detail = await getOrderById(orderId);
        setOrderDetailsCache((prev) => ({ ...prev, [orderId]: detail }));
        return detail;
      } catch (err) {
        console.error(`Failed to load order #${orderId} details:`, err);
        return null;
      }
    },
    [orderDetailsCache]
  );

  const fetchOrders = useCallback(async () => {
    setRefreshCount((previous) => previous + 1);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const controller = new AbortController();
    const statuses = activeTab === FilterTabs.All
      ? [undefined]
      : activeTab === FilterTabs.Processing
        ? ['Processing', 'Placed']
        : [activeTab.replace(/\s+/g, '')];

    Promise.all(
      statuses.map((status) =>
        getOrderHistory(
          { status, page: 1, pageSize: 50 },
          controller.signal
        )
      )
    )
      .then((responses) => {
        if (controller.signal.aborted) return;
        const uniqueOrders = new Map<number, OrderSummaryItemDto>();
        responses.forEach(({ orders: responseOrders }) => {
          responseOrders.forEach((order) => uniqueOrders.set(order.orderId, order));
        });
        const resultOrders = [...uniqueOrders.values()].sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
        );
        setOrderResult({ requestKey, orders: resultOrders, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error('Failed to load order history:', err);
        setOrderResult({
          requestKey,
          orders: [],
          error: err instanceof Error ? err.message : 'Unable to load orders.',
        });
      });

    return () => controller.abort();
  }, [activeTab, isLoggedIn, requestKey]);

  // Add freshly placed order from checkout immediately to state
  const addPlacedOrder = useCallback((order: OrderDetailDto) => {
    const summaryItem: OrderSummaryItemDto = {
      orderId: order.orderId,
      customerId: order.customerId,
      subtotal: order.subtotal,
      shippingCharge: order.shippingCharge,
      tax: order.tax,
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    };
    const normalizedStatus = order.orderStatus.toLowerCase();
    const matchesActiveTab =
      activeTab === FilterTabs.All ||
      (activeTab === FilterTabs.Processing &&
        (normalizedStatus === 'placed' || normalizedStatus === 'processing')) ||
      normalizedStatus === activeTab.toLowerCase();

    if (matchesActiveTab) {
      setOrderResult((previous) => {
        if (previous?.requestKey !== requestKey) return previous;
        const updatedOrders = [
          summaryItem,
          ...previous.orders.filter((item) => item.orderId !== order.orderId),
        ];
        return { ...previous, orders: updatedOrders };
      });
    }

    // Cache the full details right away
    setOrderDetailsCache((prev) => ({ ...prev, [order.orderId]: order }));
  }, [activeTab, requestKey]);

  const filteredOrders = orders;

  // Reorder functionality: adds all items of a delivered order back to cart
  const reorder = useCallback(
    async (orderId: number): Promise<boolean> => {
      setReorderingId(orderId);
      const toastId = toast.loading(`Adding items from order #${orderId} to cart...`);

      try {
        let orderDetail: OrderDetailDto | null = orderDetailsCache[orderId] || null;
        if (!orderDetail) {
          orderDetail = await getOrderDetail(orderId);
        }

        if (!orderDetail || !orderDetail.items || orderDetail.items.length === 0) {
          toast.error('Could not retrieve items for this order.', { id: toastId });
          return false;
        }

        for (const item of orderDetail.items) {
          await addToCart(
            {
              id: item.productId,
              name: item.productName,
              description: '',
              price: item.price,
              imageUrl: '',
              categoryId: 0,
              category: '',
              brandId: 0,
              brand: '',
              rating: 0,
            },
            item.quantity
          );
        }

        toast.success(`Added ${orderDetail.items.length} item(s) to your cart!`, { id: toastId });
        return true;
      } catch (err) {
        console.error('Reorder failed:', err);
        const msg = err instanceof Error ? err.message : 'Failed to reorder items.';
        toast.error(msg, { id: toastId });
        return false;
      } finally {
        setReorderingId(null);
      }
    },
    [orderDetailsCache, getOrderDetail, addToCart]
  );

  const value = useMemo(
    () => ({
      orders,
      filteredOrders,
      isLoading,
      error,
      activeTab,
      setActiveTab,
      orderDetailsCache,
      fetchOrders,
      getOrderDetail,
      reorder,
      addPlacedOrder,
      reorderingId,
    }),
    [
      orders,
      filteredOrders,
      isLoading,
      error,
      activeTab,
      setActiveTab,
      orderDetailsCache,
      fetchOrders,
      getOrderDetail,
      reorder,
      addPlacedOrder,
      reorderingId,
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
