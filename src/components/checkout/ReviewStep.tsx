import type { UseFormGetValues } from 'react-hook-form';
import { Pencil, MapPin, CreditCard, Package, Phone, Mail, Truck, ArrowLeft } from 'lucide-react';
import type { CartItemDto } from '../../types/CartDto';
import { PaymentMethod, formatINR, type ShippingFormData } from '../../types/OrderDto';
import Button from '../ui/Button';

interface ReviewStepProps {
  getValues: UseFormGetValues<ShippingFormData>;
  cartItems: CartItemDto[];
  shippingFee: number;
  onEditShipping: () => void;
  onEditPayment: () => void;
  onBack: () => void;
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cod]: 'Cash on Delivery (COD)',
  [PaymentMethod.Card]: 'Credit / Debit Card (Mock)',
  [PaymentMethod.Upi]: 'UPI / Net Banking (Mock)',
};

export default function ReviewStep({
  getValues,
  cartItems,
  shippingFee,
  onEditShipping,
  onEditPayment,
  onBack,
}: ReviewStepProps) {
  const selectedPaymentMethod = getValues('paymentMethod');
  const paymentMethodLabel = PAYMENT_METHOD_LABELS[selectedPaymentMethod] || selectedPaymentMethod;

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Shipping Details Card */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-brand-orange" />
            <span>SHIPPING DETAILS</span>
          </span>
          <button
            type="button"
            onClick={onEditShipping}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline uppercase"
          >
            <Pencil size={12} />
            Edit
          </button>
        </div>
        <div className="p-4 sm:p-6 text-sm text-gray-700 space-y-2">
          <p className="font-bold text-gray-900 text-base">{getValues('fullName')}</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />
              {getValues('phone')}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {getValues('email')}
            </span>
          </div>
          <p className="text-gray-700 pt-1">
            {getValues('address')}{getValues('apartment') ? `, ${getValues('apartment')}` : ''}
          </p>
          <p className="text-gray-600">
            {getValues('city')}, {getValues('state')} - {getValues('postalCode')}, {getValues('country')}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-brand-orange">
            <Truck size={13} />
            <span>Delivery: <strong className="uppercase">{getValues('shippingMethod')}</strong> ({formatINR(shippingFee)})</span>
          </div>
        </div>
      </div>

      {/* 2. Payment Method Card */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
          <span className="flex items-center gap-2">
            <CreditCard size={16} className="text-brand-orange" />
            PAYMENT METHOD
          </span>
          <button
            type="button"
            onClick={onEditPayment}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline uppercase"
          >
            <Pencil size={12} />
            Edit
          </button>
        </div>
        <div className="p-4 sm:p-6 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{paymentMethodLabel}</p>
        </div>
      </div>

      {/* 3. Products Review Card */}
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
          <Package size={16} className="text-brand-orange" />
          <span>ORDER ITEMS ({cartItems.length})</span>
        </div>
        <div className="p-4 sm:p-6 divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
              <div className="min-w-0 pr-4">
                <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} &times; {formatINR(item.price)}</p>
              </div>
              <span className="font-semibold text-gray-900 shrink-0">{formatINR(item.itemSubtotal)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-start">
        <Button variant="outline" type="button" onClick={onBack} className="flex items-center gap-1.5">
          <ArrowLeft size={16} />
          Back to Payment
        </Button>
      </div>
    </div>
  );
}
