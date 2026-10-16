import { memo } from 'react';
import { Loader2, Package, MapPin, CreditCard, Receipt } from 'lucide-react';
import type { OrderDetailDto } from '../../types/OrderDto';
import { formatINR } from '../../types/OrderDto';
import placeholderImg from '../../assets/placeholder.jpg';

interface OrderDetailsExpandedProps {
  orderDetail: OrderDetailDto | null;
  isLoading: boolean;
}

function OrderDetailsExpanded({
  orderDetail,
  isLoading,
}: OrderDetailsExpandedProps) {
  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center py-8 gap-2 text-sm text-gray-500">
        <Loader2 size={20} className="animate-spin text-brand-orange" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (!orderDetail) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center py-4">
        Unable to load order details.
      </div>
    );
  }

  const items = orderDetail.items ?? [];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-6 animate-fadeIn">
      {/* 1. Ordered Items List */}
      <div>
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Package size={14} className="text-brand-orange" />
          <span>Items Ordered ({items.length})</span>
        </h4>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.orderItemId}
              className="flex items-center justify-between p-3 rounded bg-gray-50 border border-gray-100 text-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={placeholderImg}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded border border-gray-200 shrink-0 bg-white"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    Qty: <span className="font-medium text-gray-700">{item.quantity}</span> × {formatINR(item.price ?? 0)}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 font-bold text-gray-900 ml-4">
                {formatINR(item.itemSubtotal ?? 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Shipping & Payment 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Address */}
        <div className="p-4 rounded border border-gray-100 bg-gray-50/50">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin size={14} className="text-brand-orange" />
            <span>Shipping Address</span>
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900 text-sm">
              {orderDetail.shipping?.shippingName || 'Customer'}
            </p>
            <p>{orderDetail.shipping?.shippingAddress || 'Address on file'}</p>
            {orderDetail.shipping?.shippingCity ? (
              <p>
                {orderDetail.shipping.shippingCity}, {orderDetail.shipping.shippingState} - {orderDetail.shipping.shippingPostalCode}
              </p>
            ) : null}
            <p className="text-gray-500 pt-1">
              Method:{' '}
              <span className="font-semibold uppercase text-gray-700">
                {orderDetail.shipping?.shippingMethod || 'Standard'}
              </span>{' '}
              ({formatINR(orderDetail.shipping?.shippingCharge ?? orderDetail.shippingCharge ?? 0)})
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-4 rounded border border-gray-100 bg-gray-50/50">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CreditCard size={14} className="text-brand-orange" />
            <span>Payment Information</span>
          </h4>
          <div className="text-xs text-gray-600 space-y-1.5">
            <p className="flex justify-between">
              <span>Method:</span>
              <span className="font-semibold uppercase text-gray-800">
                {orderDetail.payment?.paymentMethod || 'COD'}
              </span>
            </p>
            <p className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-green-700">
                {orderDetail.payment?.paymentStatus || 'Completed'}
              </span>
            </p>
            {orderDetail.payment?.transactionReference && (
              <p className="flex justify-between text-xs text-gray-500">
                <span>Ref:</span>
                <span className="font-mono truncate max-w-[180px]">{orderDetail.payment.transactionReference}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Price Breakdown Box */}
      <div className="p-4 rounded border border-gray-200 bg-gray-50">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Receipt size={14} className="text-brand-orange" />
          <span>Payment Breakdown</span>
        </h4>
        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatINR(orderDetail.subtotal ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatINR(orderDetail.shippingCharge ?? 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (18%):</span>
            <span>{formatINR(orderDetail.tax ?? 0)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
            <span>Total Paid:</span>
            <span className="text-brand-orange text-base">{formatINR(orderDetail.totalAmount ?? 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(OrderDetailsExpanded);
