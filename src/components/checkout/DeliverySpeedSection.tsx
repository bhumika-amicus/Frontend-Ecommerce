import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Truck, Zap, Clock } from 'lucide-react';
import {
  ShippingMethod,
  shippingRates,
  formatINR,
  type ShippingFormData,
} from '../../types/OrderDto';

const SHIPPING_SPEED_OPTIONS = [
  {
    id: ShippingMethod.Standard,
    title: 'Standard Shipping',
    desc: 'Delivered in 5–7 business days',
    icon: Truck,
  },
  {
    id: ShippingMethod.Express,
    title: 'Express Shipping',
    desc: 'Delivered in 2–3 business days',
    icon: Zap,
  },
  {
    id: ShippingMethod.SameDay,
    title: 'Same Day Delivery',
    desc: 'Delivered today (Order before 2 PM)',
    icon: Clock,
  },
] as const;

interface DeliverySpeedSectionProps {
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
}

export default function DeliverySpeedSection({
  register,
  errors,
}: DeliverySpeedSectionProps) {
  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
        Delivery Speed
      </h2>
      <div className="flex flex-col gap-3">
        {SHIPPING_SPEED_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <label
              key={option.id}
              className="flex items-center justify-between gap-3 rounded border border-gray-200 p-3.5 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="radio"
                  value={option.id}
                  className="text-brand-orange focus:ring-brand-orange shrink-0"
                  {...register('shippingMethod', {
                    required: 'Please select a delivery speed',
                  })}
                />
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {option.title}
                  </div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-gray-700">
                {formatINR(shippingRates[option.id])}
              </span>
            </label>
          );
        })}
      </div>
      {errors.shippingMethod?.message && (
        <p className="text-red-500 text-xs mt-2">
          {errors.shippingMethod.message}
        </p>
      )}
    </div>
  );
}
