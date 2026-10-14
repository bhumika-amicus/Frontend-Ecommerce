import { ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import type { CartItemDto } from '../../types/CartDto';
import { formatINR } from '../../types/OrderDto';
import Button from '../ui/Button';

interface OrderSummaryProps {
  cartItems: CartItemDto[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  currentStep: 1 | 2 | 3;
  isSubmitting: boolean;
  onContinueToPayment: () => void;
  onContinueToReview: () => void;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  tax,
  total,
  currentStep,
  isSubmitting,
  onContinueToPayment,
  onContinueToReview,
}: OrderSummaryProps) {
  return (
    <aside className="w-full min-w-0 lg:sticky lg:top-5">
      <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
          <ShoppingBag size={18} className="text-brand-orange" />
          <span>ORDER SUMMARY</span>
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-gray-600">
                <span className="truncate mr-4">{item.productName} x{item.quantity}</span>
                <span>{formatINR(item.itemSubtotal)}</span>
              </div>
            ))}
          </div>

          <hr className="border-gray-200 mb-6" />

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal:</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping:</span>
              <span>{formatINR(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (18%):</span>
              <span>{formatINR(tax)}</span>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-xl text-gray-800">Total:</span>
            <span className="font-bold text-2xl text-[#ff6b00]">{formatINR(total)}</span>
          </div>

          {currentStep === 1 && (
            <Button
              variant="primary"
              type="button"
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2"
              onClick={onContinueToPayment}
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight size={16} />
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              variant="primary"
              type="button"
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2"
              onClick={onContinueToReview}
            >
              <span>CONTINUE TO REVIEW</span>
              <ArrowRight size={16} />
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="w-full uppercase tracking-wider py-3 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>PLACING ORDER...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>PLACE ORDER</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
