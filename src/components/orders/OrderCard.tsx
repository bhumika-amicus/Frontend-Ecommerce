import { useState, memo } from 'react';
import { Loader2, ChevronDown, ChevronUp, RotateCcw, Truck } from 'lucide-react';
import type { OrderSummaryItemDto, OrderDetailDto } from '../../types/OrderDto';
import { formatINR } from '../../types/OrderDto';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetailsExpanded from './OrderDetailsExpanded';
import placeholderImg from '../../assets/placeholder.jpg';

interface OrderCardProps {
  order: OrderSummaryItemDto;
  cachedDetail?: OrderDetailDto;
  onFetchDetail: (orderId: number) => Promise<OrderDetailDto | null>;
  onReorder: (orderId: number) => Promise<boolean>;
  isReordering: boolean;
}

function OrderCard({
  order,
  cachedDetail,
  onFetchDetail,
  onReorder,
  isReordering,
}: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const detail = cachedDetail ?? null;
  const hasFullDetail = Boolean(detail && Array.isArray(detail.items) && detail.items.length > 0);

  const handleToggleExpand = async () => {
    if (!isExpanded && !hasFullDetail) {
      setIsLoadingDetail(true);
      await onFetchDetail(order.orderId);
      setIsLoadingDetail(false);
    }
    setIsExpanded((prev) => !prev);
  };

  // Formatted Order ID matching mockup e.g. ORD-2026-001
  const formattedOrderId = `ORD-2026-${order.orderId.toString().padStart(3, '0')}`;

  // Formatted date matching mockup e.g. Placed: May 10, 2026
  const formattedDate = (() => {
    if (!order.createdAt) return 'Today';
    try {
      const d = new Date(order.createdAt);
      if (isNaN(d.getTime())) return order.createdAt;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return order.createdAt || 'Today';
    }
  })();

  // Item count
  const itemCount = detail?.items ? detail.items.length : 1;
  const isDelivered = (order.orderStatus || '').toLowerCase() === 'delivered';
  const isProcessingOrShipped =
    (order.orderStatus || '').toLowerCase() === 'processing' ||
    (order.orderStatus || '').toLowerCase() === 'placed' ||
    (order.orderStatus || '').toLowerCase() === 'pending' ||
    (order.orderStatus || '').toLowerCase() === 'shipped';

  // Number of thumbnail boxes to display (up to 3)
  const thumbnailCount = detail?.items?.length ? Math.min(detail.items.length, 3) : 1;

  return (
    <div className="rounded border border-gray-200 bg-white p-5 mb-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex flex-wrap items-baseline gap-3 sm:gap-6">
          <span className="font-bold text-gray-900 text-base sm:text-lg">
            Order: {formattedOrderId}
          </span>
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Placed: {formattedDate}
          </span>
        </div>
        <OrderStatusBadge status={order.orderStatus} />
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        {/* Left Info: Items Count & Total */}
        <div className="shrink-0 min-w-30">
          <p className="text-xs font-medium text-gray-500 mb-1">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </p>
          <p className="font-bold text-base sm:text-lg text-[#ff5a00]">
            Total: {formatINR(order.totalAmount)}
          </p>
        </div>

        {/* Center: Product Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {Array.from({ length: thumbnailCount }).map((_, idx) => (
            <div
              key={idx}
              className="w-12 h-12 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0"
            >
              <img
                src={placeholderImg}
                alt="Product thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {detail?.items && detail.items.length > 3 && (
            <span className="text-xs font-semibold text-gray-400 pl-1">
              +{detail.items.length - 3}
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={handleToggleExpand}
            className="inline-flex items-center gap-1.5 bg-[#ff5a00] hover:bg-[#e65100] text-white font-bold text-xs uppercase px-4 py-2.5 rounded tracking-wider transition-colors shadow-sm cursor-pointer"
          >
            <span>{isExpanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}</span>
            {isExpanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
          </button>

          {isDelivered && (
            <button
              type="button"
              disabled={isReordering}
              onClick={() => onReorder(order.orderId)}
              className="inline-flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-black text-white font-bold text-xs uppercase px-4 py-2.5 rounded tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isReordering ? (
                <>
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                  <span>ADDING...</span>
                </>
              ) : (
                <>
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>REORDER</span>
                </>
              )}
            </button>
          )}

          {isProcessingOrShipped && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white font-bold text-xs uppercase px-4 py-2.5 rounded tracking-wider shadow-sm cursor-default"
            >
              <Truck size={13} aria-hidden="true" />
              <span>TRACK ORDER</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Order Details */}
      {isExpanded && (
        <OrderDetailsExpanded orderDetail={detail} isLoading={isLoadingDetail} />
      )}
    </div>
  );
}

export default memo(OrderCard);
