import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import CheckoutSteps from '../components/layout/CheckoutSteps'
import ShippingStep from '../components/checkout/ShippingStep'
import PaymentStep from '../components/checkout/PaymentStep'
import ReviewStep from '../components/checkout/ReviewStep'
import OrderSummary from '../components/checkout/OrderSummary'
import CheckoutSkeleton from '../components/checkout/CheckoutSkeleton'
import { useCart } from '../hooks/useCart'
import { usePageMeta } from '../hooks/usePageMeta'
import { createAddress, createCheckout, processMockPayment } from '../services/orderApi'
import {
    initialShippingFormData,
    shippingRates,
    type ShippingFormData,
    type ShippingMethod as ShippingMethodType,
    type AddressDto,
    type CheckoutResponse,
} from '../types/OrderDto'

function Checkout() {
    const navigate = useNavigate()
    const { cartItems, isCartLoading, clearCart } = useCart()
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
    const [createdOrder, setCreatedOrder] = useState<CheckoutResponse | null>(null)
    const [pendingOrderId, setPendingOrderId] = useState<number | null>(null)

    usePageMeta(
        'Checkout',
        'Secure multi-step checkout: Enter shipping address, choose delivery speed, and complete payment on Trendify.'
    )

    useEffect(() => {
        // Empty cart guard: wait until cart sync is finished, then redirect if still empty
        if (!isCartLoading && cartItems.length === 0 && !createdOrder) {
            toast.error('Your cart is empty. Please add items before checking out.', { id: 'empty-cart-toast' })
            navigate('/products', { replace: true })
        }
    }, [isCartLoading, cartItems.length, createdOrder, navigate])

    const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null)
    const selectedAddressId = selectedAddress?.addressId ?? null

    const {
        control,
        register,
        handleSubmit,
        reset,
        resetField,
        setValue,
        trigger,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ShippingFormData>({
        defaultValues: initialShippingFormData,
        mode: 'onTouched',
        reValidateMode: 'onChange',
    })

    const selectedShippingMethod = useWatch({ control, name: 'shippingMethod' })

    const { subtotal, shippingFee, tax, total } = useMemo(() => {
        const subtotal = cartItems.reduce(
            (sum, item) => sum + (item.itemSubtotal ?? item.price * item.quantity),
            0
        )
        const shippingFee = selectedShippingMethod && selectedShippingMethod in shippingRates
            ? shippingRates[selectedShippingMethod as ShippingMethodType]
            : 0
        const tax = subtotal * 0.18 // 18% Tax matching backend
        const total = subtotal + tax + shippingFee
        return { subtotal, shippingFee, tax, total }
    }, [cartItems, selectedShippingMethod])

    const handleContinueToPayment = async () => {
        // Validate contact info & shipping method
        const isContactValid = await trigger([
            'fullName',
            'email',
            'phone',
            'shippingMethod',
        ])
        if (!isContactValid) return

        // If no address selected yet, check if form has valid address and auto-save
        if (!selectedAddressId) {
            const isAddressValid = await trigger([
                'country',
                'state',
                'city',
                'postalCode',
                'address',
            ])
            if (!isAddressValid) {
                toast.error('Please enter and save a shipping address.', { id: 'address-required' })
                return
            }

            try {
                const formData = getValues()
                const addressRes = await createAddress({
                    addressLine1: formData.address.trim(),
                    addressLine2: formData.apartment?.trim() || null,
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    postalCode: formData.postalCode.trim(),
                    country: formData.country.trim(),
                    isDefault: Boolean(formData.isDefault),
                })

                if (addressRes?.addressId) {
                    setSelectedAddress({
                        addressId: addressRes.addressId,
                        addressLine1: formData.address.trim(),
                        addressLine2: formData.apartment?.trim() || null,
                        city: formData.city.trim(),
                        state: formData.state.trim(),
                        postalCode: formData.postalCode.trim(),
                        country: formData.country.trim(),
                        isDefault: Boolean(formData.isDefault),
                    })
                    toast.success('Address saved successfully!', { id: 'address-auto-save' })
                    setCurrentStep(2)
                    return
                }
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Failed to save address'
                toast.error(msg, { id: 'address-save-error' })
                return
            }
        }

        setCurrentStep(2)
    }

    const handleBackToShipping = () => {
        setCurrentStep(1)
    }

    const handleContinueToReview = () => {
        setCurrentStep(3)
    }

    const handleEditShipping = () => {
        setPendingOrderId(null)
        setCurrentStep(1)
    }

    const handleGoToPayment = () => {
        setCurrentStep(2)
    }

    const onSubmit = async (formData: ShippingFormData) => {
        try {
            if (!selectedAddressId) {
                toast.error('Please select or save a shipping address.', { id: 'address-missing' })
                setCurrentStep(1)
                return
            }

            let orderId = pendingOrderId
            let checkoutResult = createdOrder

            // Step 1: Create checkout order if not already created (prevents duplicate orders on payment retries)
            if (!orderId) {
                const checkoutRes = await createCheckout({
                    addressId: selectedAddressId,
                    shippingMethod: formData.shippingMethod as ShippingMethodType,
                    paymentMethod: formData.paymentMethod,
                })

                // Handle potential stock or pricing issues
                if (!checkoutRes.orderId) {
                    if (checkoutRes.stockIssues && checkoutRes.stockIssues.length > 0) {
                        toast.error('Some items in your cart are currently out of stock.', { id: 'checkout-stock-issue' })
                    } else if (checkoutRes.priceChanges && checkoutRes.priceChanges.length > 0) {
                        toast.error('Some product prices have changed. Please review your cart.', { id: 'checkout-price-issue' })
                    } else {
                        toast.error('Unable to create checkout order. Please check your cart.', { id: 'checkout-failed' })
                    }
                    return
                }

                orderId = checkoutRes.orderId
                checkoutResult = checkoutRes
                setPendingOrderId(orderId)
            }

            // Step 2: Call Payment API: POST /api/payments/mock with { orderId, paymentMethod }
            const paymentRes = await processMockPayment(orderId, formData.paymentMethod)

            // Step 3: Verify payment success
            if (paymentRes.paymentStatus !== 'Success') {
                toast.error('Payment was not successful. Please retry or choose another payment method.', { id: 'payment-failed' })
                return
            }

            // Step 4: Success! Finalize order, clear cart, reset form, and navigate to /orders
            setCreatedOrder(checkoutResult)
            setPendingOrderId(null)
            clearCart()
            reset(initialShippingFormData)

            toast.success('Order placed successfully!', { id: 'order-success-toast' })
            navigate('/orders', { replace: true, state: { orderId } })
        } catch (error) {
            console.error('Order placement or payment failed:', error)
            const message = error instanceof Error ? error.message : 'Failed to complete order. Please try again.'
            toast.error(message, { id: 'order-error-toast' })
        }
    }



    if (isCartLoading) {
        return <CheckoutSkeleton />
    }

    if (cartItems.length === 0 && !createdOrder) {
        return null
    }

    return (
        <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
            <Breadcrumbs />

            <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:mb-8 md:text-3xl">
                Checkout
            </h1>

            <CheckoutSteps currentStep={currentStep} />

            <form
                className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:gap-8"
                noValidate
                onKeyDown={(e) => {
                    if (e.target instanceof HTMLTextAreaElement) return
                    if (e.key === 'Enter' && currentStep !== 3) {
                        e.preventDefault()
                        if (currentStep === 1) {
                            void handleContinueToPayment()
                        } else if (currentStep === 2) {
                            handleContinueToReview()
                        }
                    }
                }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="min-w-0">
                    <div className={currentStep === 1 ? 'block' : 'hidden'}>
                        <ShippingStep
                            register={register}
                            errors={errors}
                            control={control}
                            resetField={resetField}
                            setValue={setValue}
                            getValues={getValues}
                            trigger={trigger}
                            selectedAddressId={selectedAddressId}
                            onSelectAddress={(addr) => setSelectedAddress(addr)}
                        />
                    </div>

                    <div className={currentStep === 2 ? 'block' : 'hidden'}>
                        <PaymentStep
                            register={register}
                            onBack={handleBackToShipping}
                        />
                    </div>

                    {currentStep === 3 && (
                        <ReviewStep
                            getValues={getValues}
                            cartItems={cartItems}
                            shippingFee={shippingFee}
                            onEditShipping={handleEditShipping}
                            onEditPayment={handleGoToPayment}
                            onBack={handleGoToPayment}
                        />
                    )}
                </div>

                <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    shippingFee={shippingFee}
                    tax={tax}
                    total={total}
                    currentStep={currentStep}
                    isSubmitting={isSubmitting}
                    onContinueToPayment={handleContinueToPayment}
                    onContinueToReview={handleContinueToReview}
                />
            </form>
        </div>
    )
}

export default Checkout