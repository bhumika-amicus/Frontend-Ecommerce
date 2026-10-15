import type { UseFormRegister } from 'react-hook-form';
import { Banknote, CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { PaymentMethod, type ShippingFormData } from '../../types/OrderDto';
import Button from '../common/Button';

interface PaymentStepProps {
  register: UseFormRegister<ShippingFormData>;
  onBack: () => void;
}

const PAYMENT_OPTIONS = [
  {
    id: PaymentMethod.Cod,
    title: 'Cash on Delivery (COD)',
    description: 'Pay with cash upon delivery',
    icon: Banknote,
  },
  {
    id: PaymentMethod.Card,
    title: 'Credit / Debit Card (Mock)',
    description: 'Instant test card payment via mock gateway',
    icon: CreditCard,
  },
  {
    id: PaymentMethod.Upi,
    title: 'UPI / Net Banking (Mock)',
    description: 'Google Pay, PhonePe, Paytm test payment',
    icon: Smartphone,
  },
] as const;

export default function PaymentStep({
  register,
  onBack,
}: PaymentStepProps) {
  return (
    <section className="mb-6 min-w-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
        <CreditCard size={18} className="text-brand-orange" />
        <span>PAYMENT METHOD</span>
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-sm text-gray-600 mb-4">Select your preferred payment method:</p>
        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map(({ id, title, description, icon: Icon }) => (
            <label
              key={id}
              className="flex items-center gap-3.5 rounded border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                value={id}
                className="text-brand-orange focus:ring-brand-orange shrink-0"
                {...register('paymentMethod')}
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-start">
          <Button variant="outline" type="button" onClick={onBack} className="flex items-center gap-1.5">
            <ArrowLeft size={16} />
            Back to Shipping
          </Button>
        </div>
      </div>
    </section>
  );
}
