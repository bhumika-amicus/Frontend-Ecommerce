import { useState, useEffect, useCallback, useRef } from 'react';
import { useWatch } from 'react-hook-form';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormResetField,
  Control,
  UseFormSetValue,
  UseFormGetValues,
  UseFormTrigger,
} from 'react-hook-form';
import { Truck, Zap, Clock, MapPin, Pencil, Plus, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCountries, getStates, getCities } from '../../services/locationApi';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/orderApi';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../hooks/useAuth';
import AddressCard from './AddressCard';
import Button from '../ui/Button';
import {
  ShippingMethod,
  shippingRates,
  formatINR,
  type ShippingFormData,
  type AddressDto,
  type CreateAddressRequest,
  type UpdateAddressRequest,
} from '../../types/OrderDto';

interface ShippingStepProps {
  register: UseFormRegister<ShippingFormData>;
  errors: FieldErrors<ShippingFormData>;
  control: Control<ShippingFormData>;
  resetField: UseFormResetField<ShippingFormData>;
  setValue: UseFormSetValue<ShippingFormData>;
  getValues: UseFormGetValues<ShippingFormData>;
  trigger: UseFormTrigger<ShippingFormData>;
  selectedAddressId: number | null;
  onSelectAddress: (address: AddressDto | null) => void;
}

type FormMode = 'view' | 'create' | 'edit';

export default function ShippingStep({
  register,
  errors,
  control,
  resetField,
  setValue,
  getValues,
  trigger,
  selectedAddressId,
  onSelectAddress,
}: ShippingStepProps) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(true);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const addressSectionRef = useRef<HTMLDivElement>(null);

  // Watch country and state for dynamic cascading dropdowns
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
    { skip: !selectedCountry }
  );

  const {
    data: citiesData,
    isLoading: isLoadingCities,
    error: citiesError,
  } = useFetch(
    (signal) => getCities(selectedCountry, selectedState, signal),
    [selectedCountry, selectedState],
    { skip: !selectedCountry || !selectedState }
  );

  const countries = countriesData || [];
  const states = statesData || [];
  const cities = citiesData || [];
  const locationError = countriesError || statesError || citiesError;

  // Pre-fill user contact information if empty
  useEffect(() => {
    if (user?.name && !getValues('fullName')) {
      setValue('fullName', user.name);
    }
    if (user?.email && !getValues('email')) {
      setValue('email', user.email);
    }
  }, [user, getValues, setValue]);

  // Helper to populate form fields with an address
  const populateAddressFields = useCallback(
    (addr: AddressDto) => {
      setValue('country', addr.country);
      setValue('state', addr.state);
      setValue('city', addr.city);
      setValue('postalCode', addr.postalCode);
      setValue('address', addr.addressLine1);
      setValue('apartment', addr.addressLine2 || '');
      setValue('isDefault', addr.isDefault);
    },
    [setValue]
  );

  // Initial load of addresses from backend
  useEffect(() => {
    let isCancelled = false;
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const fetched = await getAddresses();
        if (isCancelled) return;
        setAddresses(fetched);

        if (fetched.length > 0) {
          // Find currently selected or default address
          const defaultAddress =
            fetched.find((a) => a.addressId === selectedAddressId) ||
            fetched.find((a) => a.isDefault) ||
            fetched[0];

          onSelectAddress(defaultAddress);
          populateAddressFields(defaultAddress);
          setFormMode('view');
          setEditingAddressId(null);
        } else {
          // No addresses: form is writable
          onSelectAddress(null);
          setFormMode('create');
          setEditingAddressId(null);
        }
      } catch (err) {
        console.error('Failed to load saved addresses:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingAddresses(false);
        }
      }
    };

    void fetchAddresses();

    return () => {
      isCancelled = true;
    };
  }, [populateAddressFields]); // eslint-disable-line react-hooks/exhaustive-deps

  // Select a card
  const handleSelectCard = (addr: AddressDto) => {
    onSelectAddress(addr);
    populateAddressFields(addr);
    setFormMode('view');
    setEditingAddressId(null);
  };

  // Start editing an address
  const handleStartEdit = (addr: AddressDto) => {
    setEditingAddressId(addr.addressId);
    setFormMode('edit');
    populateAddressFields(addr);
    if (addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Start adding a new address
  const handleStartAddNew = () => {
    setEditingAddressId(null);
    setFormMode('create');
    setValue('country', '', { shouldValidate: false });
    setValue('state', '', { shouldValidate: false });
    setValue('city', '', { shouldValidate: false });
    setValue('postalCode', '', { shouldValidate: false });
    setValue('address', '', { shouldValidate: false });
    setValue('apartment', '');
    setValue('isDefault', false);
    if (addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel edit or create
  const handleCancelFormMode = () => {
    setEditingAddressId(null);
    const fallback =
      addresses.find((a) => a.addressId === selectedAddressId) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0];

    if (fallback) {
      onSelectAddress(fallback);
      populateAddressFields(fallback);
      setFormMode('view');
    } else {
      setFormMode('create');
    }
  };

  // Save new address
  const handleSaveAddress = async () => {
    const isValid = await trigger([
      'country',
      'state',
      'city',
      'postalCode',
      'address',
    ]);
    if (!isValid) return;

    setIsSavingAddress(true);
    try {
      const formData = getValues();
      const payload: CreateAddressRequest = {
        addressLine1: formData.address.trim(),
        addressLine2: formData.apartment?.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        isDefault: Boolean(formData.isDefault),
      };

      const res = await createAddress(payload);
      toast.success('Address saved successfully!', { id: 'address-toast' });

      // Refresh address list from backend
      const updated = await getAddresses();
      setAddresses(updated);

      const newlyCreated = updated.find((a) => a.addressId === res.addressId) || updated[0];
      if (newlyCreated) {
        onSelectAddress(newlyCreated);
        populateAddressFields(newlyCreated);
      }
      setFormMode('view');
      setEditingAddressId(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save address';
      toast.error(msg, { id: 'address-error-toast' });
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Update existing address
  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;

    const isValid = await trigger([
      'country',
      'state',
      'city',
      'postalCode',
      'address',
    ]);
    if (!isValid) return;

    setIsSavingAddress(true);
    try {
      const formData = getValues();
      const payload: UpdateAddressRequest = {
        addressLine1: formData.address.trim(),
        addressLine2: formData.apartment?.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        country: formData.country.trim(),
        isDefault: Boolean(formData.isDefault),
      };

      await updateAddress(editingAddressId, payload);
      toast.success('Address updated successfully!', { id: 'address-toast' });

      // Refresh address list
      const updated = await getAddresses();
      setAddresses(updated);

      const updatedAddr = updated.find((a) => a.addressId === editingAddressId) || updated[0];
      if (updatedAddr) {
        onSelectAddress(updatedAddr);
        populateAddressFields(updatedAddr);
      }
      setEditingAddressId(null);
      setFormMode('view');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update address';
      toast.error(msg, { id: 'address-error-toast' });
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Delete an address
  const handleDeleteAddress = async (addressId: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setDeletingId(addressId);
    try {
      await deleteAddress(addressId);
      toast.success('Address deleted', { id: 'address-toast' });

      const updated = await getAddresses();
      setAddresses(updated);

      if (selectedAddressId === addressId) {
        if (updated.length > 0) {
          const next = updated.find((a) => a.isDefault) || updated[0];
          onSelectAddress(next);
          populateAddressFields(next);
          setFormMode('view');
        } else {
          onSelectAddress(null);
          handleStartAddNew();
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete address';
      toast.error(msg, { id: 'address-error-toast' });
    } finally {
      setDeletingId(null);
    }
  };

  const isReadOnly = formMode === 'view';

  return (
    <section className="mb-6 min-w-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
        <Truck size={18} className="text-brand-orange" />
        <span>SHIPPING & DELIVERY</span>
      </div>

      <div className="p-4 sm:p-6" ref={addressSectionRef}>
        {locationError && <p className="text-red-500 mb-4 text-sm">{locationError}</p>}

        {/* 1. Contact Information Header */}
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

        {/* 2. Sustained Address Form Section */}
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
            {formMode === 'create' && addresses.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                <Plus size={11} />
                New Address
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {(formMode === 'edit' || (formMode === 'create' && addresses.length > 0)) && (
              <button
                type="button"
                onClick={handleCancelFormMode}
                className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
              >
                <X size={13} />
                Cancel
              </button>
            )}
          </div>
        </div>

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
                  isLoadingStates ? 'bg-gray-100 text-gray-500 pointer-events-none' : 'bg-white'
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
                {selectedState && !states.some((s) => s.name === selectedState) && (
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
                  isLoadingCities ? 'bg-gray-100 text-gray-500 pointer-events-none' : 'bg-white'
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
                isReadOnly ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed' : 'bg-white'
              } ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
              {...register('postalCode', {
                required: 'ZIP code is required',
                validate: (value) => /^\d{5,6}$/.test(value) || 'ZIP code must contain 5–6 digits',
              })}
            />
            {errors.postalCode?.message && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
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
                isReadOnly ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed' : 'bg-white'
              } ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
              {...register('address', {
                required: 'Street address is required',
                validate: (value) => {
                  const trimmed = value.trim();
                  if (!trimmed) return 'Street address is required';
                  if (trimmed.length < 10) return 'Street address must be at least 10 characters';
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
                isReadOnly ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300'
              }`}
              {...register('apartment')}
            />
          </div>
        </div>

        {/* Set as default checkbox (only active in edit or create mode) */}
        {!isReadOnly && (
          <div className="mt-4 flex items-center gap-2">
            <input
              id="isDefault"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange"
              {...register('isDefault')}
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
              Set as default shipping address
            </label>
          </div>
        )}

        {/* Form Action Buttons (Save Address / Update Address / Cancel) */}
        {!isReadOnly && (
          <div className="mt-5 flex items-center gap-3">
            {formMode === 'create' && (
              <Button
                variant="primary"
                type="button"
                disabled={isSavingAddress}
                onClick={() => void handleSaveAddress()}
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
                onClick={() => void handleUpdateAddress()}
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

            {addresses.length > 0 && (
              <Button
                variant="outline"
                type="button"
                onClick={handleCancelFormMode}
                className="py-2 px-4 text-sm"
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* 3. Saved Addresses Cards Section Below Form */}
        {isLoadingAddresses ? (
          <div className="mt-8 border-t border-gray-200 pt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin text-brand-orange" />
            <span>Loading your saved addresses...</span>
          </div>
        ) : addresses.length > 0 ? (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                <MapPin size={16} className="text-brand-orange" />
                <span>Saved Addresses ({addresses.length})</span>
              </h3>

              {formMode === 'view' && (
                <button
                  type="button"
                  onClick={handleStartAddNew}
                  className="inline-flex items-center gap-1.5 rounded bg-orange-50 px-2.5 py-1 text-xs font-semibold text-brand-orange hover:bg-orange-100 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.addressId}
                  address={addr}
                  isSelected={selectedAddressId === addr.addressId}
                  onSelect={handleSelectCard}
                  onEdit={handleStartEdit}
                  onDelete={handleDeleteAddress}
                  isDeleting={deletingId === addr.addressId}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* 4. Shipping Method Selection (Delivery Speed) */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-3">
            Delivery Speed
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between gap-3 rounded border border-gray-200 p-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="radio"
                  value={ShippingMethod.Standard}
                  className="text-brand-orange focus:ring-brand-orange shrink-0"
                  {...register('shippingMethod', { required: 'Please select a delivery speed' })}
                />
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <Truck size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Standard Shipping</div>
                  <div className="text-xs text-gray-500">Delivered in 5–7 business days</div>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-gray-700">
                {formatINR(shippingRates[ShippingMethod.Standard])}
              </span>
            </label>

            <label className="flex items-center justify-between gap-3 rounded border border-gray-200 p-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="radio"
                  value={ShippingMethod.Express}
                  className="text-brand-orange focus:ring-brand-orange shrink-0"
                  {...register('shippingMethod', { required: 'Please select a delivery speed' })}
                />
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Express Shipping</div>
                  <div className="text-xs text-gray-500">Delivered in 2–3 business days</div>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-gray-700">
                {formatINR(shippingRates[ShippingMethod.Express])}
              </span>
            </label>

            <label className="flex items-center justify-between gap-3 rounded border border-gray-200 p-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="radio"
                  value={ShippingMethod.SameDay}
                  className="text-brand-orange focus:ring-brand-orange shrink-0"
                  {...register('shippingMethod', { required: 'Please select a delivery speed' })}
                />
                <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0 text-brand-orange">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Same Day Delivery</div>
                  <div className="text-xs text-gray-500">Delivered today (Order before 2 PM)</div>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-gray-700">
                {formatINR(shippingRates[ShippingMethod.SameDay])}
              </span>
            </label>
          </div>
          {errors.shippingMethod?.message && (
            <p className="text-red-500 text-xs mt-2">{errors.shippingMethod.message}</p>
          )}
        </div>
      </div>
    </section>
  );
}
