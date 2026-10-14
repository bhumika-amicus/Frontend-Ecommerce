import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import OrderFilterTabs from '../components/orders/OrderFilterTabs';
import OrderCard from '../components/orders/OrderCard';
import OrderEmptyState from '../components/orders/OrderEmptyState';
import { useOrders } from '../hooks/useOrders';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Orders() {
  usePageMeta(
    'My Orders',
    'Track delivery progress, inspect items, and reorder from your purchase history on Trendify.'
  );
  const location = useLocation();
  const {
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
  } = useOrders();

  // Trigger the first data load when the Orders page is visited.
  // OrderProvider is mounted at app root but intentionally defers fetching
  // until a page actually needs orders data.
  useEffect(() => {
    void fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount — fetchOrders is stable (useCallback with no deps)

  // If navigated from Checkout with a newly placed order, refresh orders and fetch full detail
  useEffect(() => {
    const stateOrderId = location.state?.orderId as number | undefined;
    if (stateOrderId) {
      void getOrderDetail(stateOrderId);
      void fetchOrders();
    }
  }, [location.state, getOrderDetail, fetchOrders]);

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs />

      {/* 2. Page Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        My Orders
      </h1>

      {/* 3. Filter Tabs */}
      <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 4. Loading Skeletons */}
      {isLoading && filteredOrders.length === 0 && (
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded border border-gray-200 bg-white p-5 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <div className="h-5 w-44 bg-gray-200 rounded" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                  <div className="h-6 w-28 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                </div>
                <div className="h-9 w-28 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Error State */}
      {!isLoading && error && filteredOrders.length === 0 && (
        <div className="p-6 text-center rounded border border-red-200 bg-red-50 text-red-700 my-6">
          <p className="font-semibold mb-2">Failed to load orders</p>
          <p className="text-sm mb-4">{error}</p>
          <button
            type="button"
            onClick={() => void fetchOrders()}
            className="bg-[#ff5a00] hover:bg-[#e65100] text-white font-bold text-xs uppercase px-5 py-2.5 rounded tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 6. Empty State */}
      {!isLoading && filteredOrders.length === 0 && !error && (
        <OrderEmptyState tabName={activeTab} />
      )}

      {/* 7. Orders List */}
      {filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              cachedDetail={orderDetailsCache[order.orderId]}
              onFetchDetail={getOrderDetail}
              onReorder={reorder}
              isReordering={reorderingId === order.orderId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
