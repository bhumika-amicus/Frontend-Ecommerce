import type { UseFormGetValues } from 'react-hook-form';
import { Pencil, MapPin, CreditCard, Package, Phone, Mail, Truck, ArrowLeft } from 'lucide-react';
import type { CartItemDto } from '../../types/CartDto';
import { PaymentMethod, formatINR, type ShippingFormData } from '../../types/OrderDto';
import Button from '../common/Button';

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

interface ReviewSectionProps {
  title: string;
  icon: React.ReactNode;
  onEdit?: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-3 font-bold tracking-wider text-white sm:px-6">
        <span className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline uppercase cursor-pointer"
          >
            <Pencil size={12} />
            <span>Edit</span>
          </button>
        )}
      </div>
      <div className="p-4 sm:p-6 text-sm text-gray-700">{children}</div>
    </div>
  );
}

export default function ReviewStep({
  getValues,
  cartItems,
  shippingFee,
  onEditShipping,
  onEditPayment,
  onBack,
}: ReviewStepProps) {
  const {
    fullName,
    phone,
    email,
    address,
    apartment,
    city,
    state,
    postalCode,
    country,
    shippingMethod,
    paymentMethod,
  } = getValues();

  const paymentMethodLabel = PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;

  return (
    <div className="space-y-6 mb-6">
      {/* 1. Shipping Details Card */}
      <ReviewSection
        title="SHIPPING DETAILS"
        icon={<MapPin size={16} className="text-brand-orange" />}
        onEdit={onEditShipping}
      >
        <div className="space-y-2">
          <p className="font-bold text-gray-900 text-base">{fullName}</p>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-gray-400" />
              {phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {email}
            </span>
          </div>
          <p className="text-gray-700 pt-1">
            {address}{apartment ? `, ${apartment}` : ''}
          </p>
          <p className="text-gray-600">
            {city}, {state} - {postalCode}, {country}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-brand-orange">
            <Truck size={13} />
            <span>Delivery: <strong className="uppercase">{shippingMethod}</strong> ({formatINR(shippingFee)})</span>
          </div>
        </div>
      </ReviewSection>

      {/* 2. Payment Method Card */}
      <ReviewSection
        title="PAYMENT METHOD"
        icon={<CreditCard size={16} className="text-brand-orange" />}
        onEdit={onEditPayment}
      >
        <p className="font-semibold text-gray-900">{paymentMethodLabel}</p>
      </ReviewSection>

      {/* 3. Products Review Card */}
      <ReviewSection
        title={`ORDER ITEMS (${cartItems.length})`}
        icon={<Package size={16} className="text-brand-orange" />}
      >
        <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto -m-2 p-2">
          {cartItems.map((item) => (
            <div key={item.productId} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
              <div className="min-w-0 pr-4">
                <p className="font-medium text-gray-800 truncate">{item.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity} &times; {formatINR(item.price)}</p>
              </div>
              <span className="font-semibold text-gray-900 shrink-0">{formatINR(item.itemSubtotal)}</span>
            </div>
          ))}
        </div>
      </ReviewSection>

      <div className="flex justify-start">
        <Button variant="outline" type="button" onClick={onBack} className="flex items-center gap-1.5">
          <ArrowLeft size={16} />
          Back to Payment
        </Button>
      </div>
    </div>
  );
}
