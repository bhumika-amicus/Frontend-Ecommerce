import { useWatch } from 'react-hook-form';
import type {
  UseFormRegister,
  FieldErrors,
  Control,
  UseFormResetField,
} from 'react-hook-form';
import { Pencil, Plus, Check, X, Loader2 } from 'lucide-react';
import { getCountries, getStates, getCities } from '../../services/locationApi';
import { useFetch } from '../../hooks/useFetch';
import Button from '../ui/Button';
import type { ShippingFormData } from '../../types/OrderDto';

interface AddressFormSectionProps {
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
  control: Control<ShippingFormData>;
  resetField: UseFormResetField<ShippingFormData>;
  formMode: 'view' | 'create' | 'edit';
  selectedAddressId: number | null;
  hasAddresses: boolean;
  isSavingAddress: boolean;
  onSaveAddress: () => void | Promise<void>;
  onUpdateAddress: () => void | Promise<void>;
  onCancel: () => void;
}

export default function AddressFormSection({
  register,
  errors,
  control,
  resetField,
  formMode,
  selectedAddressId,
  hasAddresses,
  isSavingAddress,
  onSaveAddress,
  onUpdateAddress,
  onCancel,
}: AddressFormSectionProps) {
  const selectedCountry = useWatch({ control, name: 'country' });
  const selectedState = useWatch({ control, name: 'state' });
  const selectedCity = useWatch({ control, name: 'city' });

  const {
    data: countriesData,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useFetch(getCountries);

  const {
    data: statesData,
    isLoading: isLoadingStates,
    error: statesError,
  } = useFetch(
    (signal) => getStates(selectedCountry, signal),
    [selectedCountry],
    { skip: !selectedCountry || formMode === 'view' }
  );

  const {
    data: citiesData,
    isLoading: isLoadingCities,
    error: citiesError,
  } = useFetch(
    (signal) => getCities(selectedCountry, selectedState, signal),
    [selectedCountry, selectedState],
    { skip: !selectedCountry || !selectedState || formMode === 'view' }
  );

  const countries = countriesData || [];
  const states = statesData || [];
  const cities = citiesData || [];
  const locationError = countriesError || statesError || citiesError;

  const isReadOnly = formMode === 'view';

  return (
    <>
      {locationError && (
        <p className="text-red-500 mb-4 text-sm">{locationError}</p>
      )}

      {/* Header & Badges */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">
            Shipping Address
          </h2>
          {formMode === 'view' && selectedAddressId && (
            <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-2 py-0.5 text-xs font-semibold text-brand-orange">
              <Check size={12} />
              Selected Address
            </span>
          )}
          {formMode === 'edit' && (
            <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <Pencil size={11} />
              Editing Address
            </span>
          )}
          {formMode === 'create' && hasAddresses && (
            <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <Plus size={11} />
              New Address
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(formMode === 'edit' || (formMode === 'create' && hasAddresses)) && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={13} />
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Address Form Inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country *
          </label>
          {isReadOnly ? (
            <input
              id="country"
              type="text"
              readOnly
              className="h-10 w-full min-w-0 rounded border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700 cursor-not-allowed select-none"
              {...register('country', { required: 'Country is required' })}
            />
          ) : (
            <select
              id="country"
              className={`h-10 w-full min-w-0 rounded border bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('country', {
                required: 'Country is required',
                onChange: () => {
                  resetField('state');
                  resetField('city');
                },
              })}
            >
              <option value="">
                {isLoadingCountries ? 'Loading countries...' : 'Select country'}
              </option>
              {selectedCountry && !countries.includes(selectedCountry) && (
                <option value={selectedCountry}>{selectedCountry}</option>
              )}
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          )}
          {errors.country?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-medium text-gray-700">
            State / Province *
          </label>
          {isReadOnly ? (
            <input
              id="state"
              type="text"
              readOnly
              className="h-10 w-full min-w-0 rounded border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700 cursor-not-allowed select-none"
              {...register('state', { required: 'State is required' })}
            />
          ) : (
            <select
              id="state"
              className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                isLoadingStates
                  ? 'bg-gray-100 text-gray-500 pointer-events-none'
                  : 'bg-white'
              } ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              {...register('state', {
                required: 'State is required',
                onChange: () => {
                  resetField('city');
                },
              })}
            >
              <option value="">
                {isLoadingStates
                  ? 'Loading states...'
                  : states.length
                    ? 'Select state'
                    : 'Select a country first'}
              </option>
              {selectedState &&
                !states.some((s) => s.name === selectedState) && (
                  <option value={selectedState}>{selectedState}</option>
                )}
              {states.map(({ name, state_code }) => (
                <option key={`${name}-${state_code}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          {errors.state?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-medium text-gray-700">
            City *
          </label>
          {isReadOnly ? (
            <input
              id="city"
              type="text"
              readOnly
              className="h-10 w-full min-w-0 rounded border border-gray-200 bg-gray-100 px-3 text-sm text-gray-700 cursor-not-allowed select-none"
              {...register('city', { required: 'City is required' })}
            />
          ) : (
            <select
              id="city"
              className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
                isLoadingCities
                  ? 'bg-gray-100 text-gray-500 pointer-events-none'
                  : 'bg-white'
              } ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              {...register('city', { required: 'City is required' })}
            >
              <option value="">
                {isLoadingCities
                  ? 'Loading cities...'
                  : cities.length
                    ? 'Select city'
                    : 'Select a state first'}
              </option>
              {selectedCity && !cities.includes(selectedCity) && (
                <option value={selectedCity}>{selectedCity}</option>
              )}
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
          {errors.city?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
            ZIP / Postal Code *
          </label>
          <input
            id="postalCode"
            type="text"
            inputMode="numeric"
            readOnly={isReadOnly}
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              isReadOnly
                ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                : 'bg-white'
            } ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
            {...register('postalCode', {
              required: 'ZIP code is required',
              validate: (value) =>
                /^\d{5,6}$/.test(value) || 'ZIP code must contain 5–6 digits',
            })}
          />
          {errors.postalCode?.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Street Address *
          </label>
          <input
            id="address"
            type="text"
            readOnly={isReadOnly}
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              isReadOnly
                ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                : 'bg-white'
            } ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            {...register('address', {
              required: 'Street address is required',
              validate: (value) => {
                const trimmed = value.trim();
                if (!trimmed) return 'Street address is required';
                if (trimmed.length < 10)
                  return 'Street address must be at least 10 characters';
                return true;
              },
            })}
          />
          {errors.address?.message && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="apartment" className="text-sm font-medium text-gray-700">
            Apartment / Suite (Optional)
          </label>
          <input
            id="apartment"
            type="text"
            readOnly={isReadOnly}
            className={`h-10 w-full min-w-0 rounded border px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange ${
              isReadOnly
                ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                : 'bg-white border-gray-300'
            }`}
            {...register('apartment')}
          />
        </div>
      </div>

      {/* Set as default checkbox */}
      {!isReadOnly && (
        <div className="mt-4 flex items-center gap-2">
          <input
            id="isDefault"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
            {...register('isDefault')}
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Set as default shipping address
          </label>
        </div>
      )}

      {/* Action Buttons */}
      {!isReadOnly && (
        <div className="mt-5 flex items-center gap-3">
          {formMode === 'create' && (
            <Button
              variant="primary"
              type="button"
              disabled={isSavingAddress}
              onClick={() => void onSaveAddress()}
              className="flex items-center gap-1.5 py-2 px-5 text-sm uppercase tracking-wider"
            >
              {isSavingAddress ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Address</span>
                </>
              )}
            </Button>
          )}

          {formMode === 'edit' && (
            <Button
              variant="primary"
              type="button"
              disabled={isSavingAddress}
              onClick={() => void onUpdateAddress()}
              className="flex items-center gap-1.5 py-2 px-5 text-sm uppercase tracking-wider"
            >
              {isSavingAddress ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Update Address</span>
                </>
              )}
            </Button>
          )}

          {hasAddresses && (
            <Button
              variant="outline"
              type="button"
              onClick={onCancel}
              className="py-2 px-4 text-sm"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </>
  );
}
