import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { getOrderHistory, getOrderById, reorderOrder } from '../services/orderApi';
import { useCartActions } from '../hooks/useCart';
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
  const { isLoggedIn } = useAuth();
  const { refetchCart } = useCartActions();

  const [orderDetailsCache, setOrderDetailsCache] = useState<Record<number, OrderDetailDto>>({});
  const [activeTab, setActiveTab] = useState<OrderFilterTab>(FilterTabs.All);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [orders, setOrders] = useState<OrderSummaryItemDto[]>(EMPTY_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

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

  // Track whether orders have been fetched at least once.
  // Prevents the effect from auto-firing on every page while the provider
  // is mounted at app root. The Orders page triggers the first fetch via fetchOrders().
  const hasFetched = useRef(false);

  // Auth logout listener: clear orders state when user logs out
  useEffect(() => {
    const handleLogout = () => {
      setOrders(EMPTY_ORDERS);
      setIsLoading(false);
      setError(null);
      hasFetched.current = false;
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // Main fetch effect — only runs after an explicit fetchOrders() call or tab switch post-first-load
  useEffect(() => {
    if (!isLoggedIn) return;

    // Only run if explicitly triggered (fetchOrders bumps refreshCount)
    // or if the tab changes after the first load.
    if (refreshCount === 0 && !hasFetched.current) return;

    const controller = new AbortController();

    const fetchOrdersData = async () => {
      setIsLoading(true);
      setError(null);

      const statuses = activeTab === FilterTabs.All
        ? [undefined]
        : activeTab === FilterTabs.Processing
          ? ['Placed']
          : [activeTab.replace(/\s+/g, '')];

      try {
        const responses = await Promise.all(
          statuses.map((status) =>
            getOrderHistory(
              { status, page: 1, pageSize: 50 },
              controller.signal
            )
          )
        );

        if (controller.signal.aborted) return;
        const uniqueOrders = new Map<number, OrderSummaryItemDto>();
        responses.forEach(({ orders: responseOrders }) => {
          responseOrders.forEach((order) => uniqueOrders.set(order.orderId, order));
        });
        const resultOrders = [...uniqueOrders.values()]
          .filter((order) => {
            const status = (order.orderStatus || '').toLowerCase();
            return status !== 'processing' && status !== 'pending';
          })
          .sort(
            (first, second) =>
              new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
          );
        setOrders(resultOrders);
        setError(null);
        hasFetched.current = true;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (controller.signal.aborted) return;
        console.error('Failed to load order history:', err);
        setError(err instanceof Error ? err.message : 'Unable to load orders.');
        setOrders(EMPTY_ORDERS);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchOrdersData();

    return () => controller.abort();
    // Removed user?.email — isLoggedIn already handles login/logout transitions.
    // hasFetched ref is intentionally excluded (it's a ref, not state).
  }, [activeTab, isLoggedIn, refreshCount]);

  const filteredOrders = orders;

  // Reorder functionality: adds all items of a delivered order back to cart
  const reorder = useCallback(
    async (orderId: number): Promise<boolean> => {
      if (reorderingId !== null) return false;

      setReorderingId(orderId);
      const toastId = toast.loading(`Adding items from order #${orderId} to cart...`);

      try {
        const result = await reorderOrder(orderId);
        refetchCart();
        toast.success(result.message, { id: toastId });
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
    [reorderingId, refetchCart]
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
      reorderingId,
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
