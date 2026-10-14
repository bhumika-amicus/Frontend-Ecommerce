import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { ShippingFormData } from '../../types/OrderDto';

interface ContactInfoSectionProps {
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
}

export default function ContactInfoSection({
  register,
  errors,
}: ContactInfoSectionProps) {
  return (
    <>
      <div className="mb-5 border-b border-gray-100 pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
          Contact Information
        </h2>
        <p className="text-xs text-gray-500">
          Used for delivery updates and order notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 mb-8">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('fullName', {
              required: 'Full name is required',
              validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return 'Full name is required';
                if (trimmed.length < 3) return 'Full name must be at least 3 characters';
                if (trimmed.length > 50) return 'Full name must be 50 characters or less';
                return true;
              },
            })}
          />
          {errors.fullName?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('email', {
              required: 'Email is required',
              validate: (value) => {
                const trimmed = value.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                  return 'Enter a valid email address';
                }
                return true;
              },
            })}
          />
          {errors.email?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('phone', {
              required: 'Phone number is required',
              validate: (value) => {
                if (!value.trim()) return 'Phone number is required';
                return /^\d{10}$/.test(value) || 'Phone number must contain exactly 10 digits';
              },
            })}
          />
          {errors.phone?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>
    </>
  );
}
