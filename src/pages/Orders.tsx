import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import OrderFilterTabs from '../components/orders/OrderFilterTabs';
import OrderCard from '../components/orders/OrderCard';
import OrderCardSkeleton from '../components/orders/OrderCardSkeleton';
import OrderEmptyState from '../components/orders/OrderEmptyState';
import StateMessage from '../components/ui/StateMessage';
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

  // Load orders on page mount
  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // Pre-fetch newly placed order details if redirected from checkout
  useEffect(() => {
    const stateOrderId = location.state?.orderId as number | undefined;
    if (stateOrderId) {
      void getOrderDetail(stateOrderId);
    }
  }, [location.state, getOrderDetail]);

  return (
    <div className="mx-auto min-h-[60vh] w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs />

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        My Orders
      </h1>

      <OrderFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 1. Loading Skeletons */}
      {isLoading && filteredOrders.length === 0 && (
        <div className="space-y-4">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      )}

      {/* 2. Error State */}
      {!isLoading && error && filteredOrders.length === 0 && (
        <StateMessage
          title="Failed to load orders"
          message={error}
          buttonText="Retry"
          onAction={() => void fetchOrders()}
        />
      )}

      {/* 3. Empty State */}
      {!isLoading && filteredOrders.length === 0 && !error && (
        <OrderEmptyState tabName={activeTab} />
      )}

      {/* 4. Orders List */}
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
