import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  UseFormRegister,
  FieldErrors,
  UseFormResetField,
  Control,
  UseFormSetValue,
  UseFormGetValues,
  UseFormTrigger,
} from 'react-hook-form';
import { Truck, MapPin, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/orderApi';
import { useAuth } from '../../hooks/useAuth';
import AddressCard from './AddressCard';
import ContactInfoSection from './ContactInfoSection';
import AddressFormSection from './AddressFormSection';
import DeliverySpeedSection from './DeliverySpeedSection';
import type {
  ShippingFormData,
  AddressDto,
  CreateAddressRequest,
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
  const handleSelectCard = useCallback((addr: AddressDto) => {
    onSelectAddress(addr);
    populateAddressFields(addr);
    setFormMode('view');
    setEditingAddressId(null);
  }, [onSelectAddress, populateAddressFields]);

  // Start editing an address
  const handleStartEdit = useCallback((addr: AddressDto) => {
    setEditingAddressId(addr.addressId);
    setFormMode('edit');
    populateAddressFields(addr);
    if (addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [populateAddressFields]);

  // Start adding a new address
  const handleStartAddNew = useCallback(() => {
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
  }, [setValue]);

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
  const buildAddressPayload = (): CreateAddressRequest => {
    const formData = getValues();
    return {
      addressLine1: formData.address.trim(),
      addressLine2: formData.apartment?.trim() || null,
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      country: formData.country.trim(),
      isDefault: Boolean(formData.isDefault),
    };
  };

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
      const payload = buildAddressPayload();
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
      const payload = buildAddressPayload();
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
  const handleDeleteAddress = useCallback(async (addressId: number) => {
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
  }, [selectedAddressId, onSelectAddress, populateAddressFields, handleStartAddNew]);

  return (
    <section className="mb-6 min-w-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
        <Truck size={18} className="text-brand-orange" />
        <span>SHIPPING & DELIVERY</span>
      </div>

      <div className="p-4 sm:p-6" ref={addressSectionRef}>
        {/* 1. Contact Information Header */}
        <ContactInfoSection register={register} errors={errors} />

        {/* 2. Sustained Address Form Section */}
        <AddressFormSection
          register={register}
          errors={errors}
          control={control}
          resetField={resetField}
          formMode={formMode}
          selectedAddressId={selectedAddressId}
          hasAddresses={addresses.length > 0}
          isSavingAddress={isSavingAddress}
          onSaveAddress={handleSaveAddress}
          onUpdateAddress={handleUpdateAddress}
          onCancel={handleCancelFormMode}
        />

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
        <DeliverySpeedSection register={register} errors={errors} />
      </div>
    </section>
  );
}
