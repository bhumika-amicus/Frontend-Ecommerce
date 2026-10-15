import { useState } from 'react'
import { getCountries, getStates, getCities } from '../services/locationApi'
import { useFetch } from '../hooks/useFetch'
import { usePageMeta } from '../hooks/usePageMeta'
import Breadcrumbs from '../components/common/Breadcrumbs'

interface ShippingFormData {
    fullName: string
    email: string
    phone: string
    address: string
    apartment: string
    country: string
    state: string
    city: string
    postalCode: string
    shippingMethod: string
}

const initialFormData: ShippingFormData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    shippingMethod: 'standard',
}

interface ShippingFormErrors {
    fullName?: string
    email?: string
    phone?: string
    address?: string
    country?: string
    state?: string
    city?: string
    postalCode?: string
    shippingMethod?: string
}

type ShippingField = keyof ShippingFormData
type RequiredShippingField = Exclude<ShippingField, 'apartment'>

type TouchedFields = Partial<Record<ShippingField, boolean>>

const requiredFields: RequiredShippingField[] = [
    'fullName',
    'email',
    'phone',
    'address',
    'country',
    'state',
    'city',
    'postalCode',
    'shippingMethod',
]

const shippingRates: Record<string, number> = {
    standard: 5.00,
    express: 15.00,
    overnight: 25.00
}
const subtotal = 404.94
const tax = 32.40

const validateField = (field: ShippingField, value: string): string | undefined => {
    switch (field) {
        case 'fullName':
            if (!value.trim()) {
                return 'Full name is required'
            }

            if (value.trim().length < 3) {
                return 'Full name must be at least 3 characters'
            }

            if (value.trim().length > 50) {
                return 'Full name must be 50 characters or less'
            }

            break

        case 'email':
            if (!value.trim()) {
                return 'Email is required'
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                return 'Enter a valid email address'
            }

            break

        case 'phone':
            if (!value.trim()) {
                return 'Phone number is required'
            }

            if (!/^\d{10}$/.test(value)) {
                return 'Phone number must contain exactly 10 digits'
            }

            break

        case 'address':
            if (!value.trim()) {
                return 'Street address is required'
            }

            if (value.trim().length < 10) {
                return 'Street address must be at least 10 characters'
            }

            break

        case 'apartment':
            break

        case 'country':
            if (!value) {
                return 'Country is required'
            }

            break

        case 'state':
            if (!value) {
                return 'State is required'
            }

            break

        case 'city':
            if (!value) {
                return 'City is required'
            }

            break

        case 'postalCode':
            if (!value.trim()) {
                return 'ZIP code is required'
            }

            if (!/^\d{5,6}$/.test(value)) {
                return 'ZIP code must contain 5–6 digits'
            }

            break

        case 'shippingMethod':
            if (!value) {
                return 'Shipping method is required'
            }

            break
    }

    return undefined
}

function Assignment9() {
    usePageMeta('Assignment 9', 'Shipping form validation with dynamic location cascading.')
    const [formData, setFormData] = useState<ShippingFormData>(initialFormData)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errors, setErrors] = useState<ShippingFormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({})

    const { data: countriesData, isLoading: isLoadingCountries } = useFetch(getCountries)
    
    const { data: statesData, isLoading: isLoadingStates } = useFetch(
        (signal) => getStates(formData.country, signal),
        [formData.country],
        { skip: !formData.country }
    )

    const { data: citiesData, isLoading: isLoadingCities } = useFetch(
        (signal) => getCities(formData.country, formData.state, signal),
        [formData.country, formData.state],
        { skip: !formData.country || !formData.state }
    )

    const countries = countriesData || []
    const states = statesData || []
    const cities = citiesData || []

    // --- 2. Derived State ---
    const isFormValid = requiredFields.every((field) => validateField(field, formData[field]) === undefined)
    const shippingFee = formData.shippingMethod ? shippingRates[formData.shippingMethod] || 0 : 0
    const total = subtotal + shippingFee + tax



    // --- 4. Event Handlers ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const field = name as ShippingField

        setFormData((previousData) => ({ ...previousData, [field]: value, }))

        if (touched[field]) {
            const error = validateField(field, value)
            setErrors((previousErrors) => ({ ...previousErrors, [field]: error, }))
        }
    }

    const handleCountryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const country = e.target.value

        setFormData((previousData) => ({
            ...previousData,
            country,
            state: '',
            city: '',
        }))

        setErrors((previousErrors) => ({
            ...previousErrors,
            country: undefined,
            state: undefined,
            city: undefined,
        }))

        setTouched((previousTouched) => ({
            ...previousTouched,
            country: false,
            state: false,
            city: false,
        }))
    }

    const handleStateChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const state = e.target.value

        setFormData((previousData) => ({
            ...previousData,
            state,
            city: '',
        }))

        setErrors((previousErrors) => ({
            ...previousErrors,
            state: undefined,
            city: undefined,
        }))

        setTouched((previousTouched) => ({
            ...previousTouched,
            state: false,
            city: false,
        }))
    }

    const handleCityChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const city = e.target.value

        setFormData((previousData) => ({
            ...previousData,
            city,
        }))

        setErrors((previousErrors) => ({
            ...previousErrors,
            city: undefined,
        }))

        setTouched((previousTouched) => ({
            ...previousTouched,
            city: false,
        }))
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        const field = name as ShippingField

        setTouched((previousTouched) => ({ ...previousTouched, [field]: true, }))

        const error = validateField(field, value)

        setErrors((previousErrors) => ({ ...previousErrors, [field]: error, }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isFormValid) {
            console.log('Form Submitted', formData)
            setIsSubmitted(true)
            setTimeout(() => {
                setIsSubmitted(false)
                setFormData(initialFormData)
                setTouched({})
                setErrors({})
            }, 3000)
        }
    }

    return (
        <main className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
            <Breadcrumbs />
            <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">Checkout</h1>

            {isSubmitted && (
                <div className="mb-5 rounded border border-green-200 bg-green-50 p-4 text-center font-medium text-green-700 sm:mb-6">
                    Order placed successfully!
                </div>
            )}

            <form
                className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:gap-8"
                onSubmit={handleSubmit}
            >
                <section className="mb-6 min-w-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
                    <div className="bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
                        SHIPPING INFORMATION
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {/* Full Name */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>

                            {/* Street Address */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address *</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                            </div>

                            {/* Apt / Suite */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="apartment" className="text-sm font-medium text-gray-700">Apartment / Suite (Optional)</label>
                                <input
                                    id="apartment"
                                    name="apartment"
                                    type="text"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.apartment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>

                            {/* City */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="city" className="text-sm font-medium text-gray-700">City *</label>
                                <select
                                    id="city"
                                    name="city"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange disabled:bg-gray-100"
                                    value={formData.city}
                                    onChange={handleCityChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.state || isLoadingCities}
                                >
                                    <option value="">
                                        {isLoadingCities ? 'Loading cities...' : 'Select city'}
                                    </option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                            </div>

                            {/* State */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="state" className="text-sm font-medium text-gray-700">State / Province *</label>
                                <select
                                    id="state"
                                    name="state"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange disabled:bg-gray-100"
                                    value={formData.state}
                                    onChange={handleStateChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.country || isLoadingStates}
                                >
                                    <option value="">
                                        {isLoadingStates ? 'Loading states...' : 'Select state'}
                                    </option>
                                    {states.map((stateObj) => (
                                        <option key={stateObj.name} value={stateObj.name}> {stateObj.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                            </div>

                            {/* ZIP */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">ZIP / Postal Code *</label>
                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
                            </div>

                            {/* Country */}
                            <div className="flex min-w-0 flex-col gap-1.5">
                                <label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</label>
                                <select
                                    id="country"
                                    name="country"
                                    className="h-10 w-full min-w-0 rounded border border-gray-300 bg-white px-3 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange disabled:bg-gray-100"
                                    value={formData.country}
                                    onChange={handleCountryChange}
                                    onBlur={handleBlur}
                                    disabled={isLoadingCountries}
                                >
                                    <option value="">
                                        {isLoadingCountries ? 'Loading countries...' : 'Select country'}
                                    </option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                {errors.country && <p className="mt-1 text-xs text-red-600">{errors.country}</p>}
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="mt-6 border-t border-gray-200 pt-5">
                            <h3 className="mb-4 text-base font-bold text-gray-800">Shipping Method</h3>
                            <div className="flex flex-col gap-3">
                                <label className="flex cursor-pointer items-start justify-between gap-3 rounded border border-gray-200 p-3 text-sm hover:bg-gray-50 sm:items-center">
                                    <span className="flex min-w-0 items-start gap-3 text-gray-700 sm:items-center">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="standard"
                                            className="mt-0.5 shrink-0 accent-brand-orange sm:mt-0"
                                            checked={formData.shippingMethod === 'standard'}
                                            onChange={handleChange}
                                        />
                                        Standard Shipping (5-7 days)
                                    </span>
                                    <span className="shrink-0 text-gray-600">$5.00</span>
                                </label>
                                <label className="flex cursor-pointer items-start justify-between gap-3 rounded border border-gray-200 p-3 text-sm hover:bg-gray-50 sm:items-center">
                                    <span className="flex min-w-0 items-start gap-3 text-gray-700 sm:items-center">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="express"
                                            className="mt-0.5 shrink-0 accent-brand-orange sm:mt-0"
                                            checked={formData.shippingMethod === 'express'}
                                            onChange={handleChange}
                                        />
                                        Express Shipping (2-3 days)
                                    </span>
                                    <span className="shrink-0 text-gray-600">$15.00</span>
                                </label>
                                <label className="flex cursor-pointer items-start justify-between gap-3 rounded border border-gray-200 p-3 text-sm hover:bg-gray-50 sm:items-center">
                                    <span className="flex min-w-0 items-start gap-3 text-gray-700 sm:items-center">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="overnight"
                                            className="mt-0.5 shrink-0 accent-brand-orange sm:mt-0"
                                            checked={formData.shippingMethod === 'overnight'}
                                            onChange={handleChange}
                                        />
                                        Overnight Shipping (1 day)
                                    </span>
                                    <span className="shrink-0 text-gray-600">$25.00</span>
                                </label>
                            </div>
                            {errors.shippingMethod && <p className="mt-2 text-xs text-red-600">{errors.shippingMethod}</p>}
                        </div>
                    </div>
                </section>

                <aside className="min-w-0 overflow-hidden rounded border border-gray-200 bg-white shadow-sm lg:sticky lg:top-5">
                    <div className="bg-[#1a1a1a] px-4 py-3 font-bold tracking-wider text-white sm:px-6">
                        ORDER SUMMARY
                    </div>

                    <div className="space-y-3 border-b border-gray-200 p-4 text-sm text-gray-600 sm:p-5">
                        <div className="flex justify-between gap-3">
                            <span>Wireless Headphones x2</span><span className="shrink-0">$99.98</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span>Smart Watch Pro x1</span><span className="shrink-0">$199.99</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span>USB-C Hub Adapter x3</span><span className="shrink-0">$104.97</span>
                        </div>
                    </div>

                    <div className="space-y-3 p-4 sm:p-5">
                        <div className="flex justify-between gap-3 text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span className="shrink-0">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-sm text-gray-600">
                            <span>Shipping:</span>
                            <span className="shrink-0">${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between gap-3 text-sm text-gray-600">
                            <span>Tax:</span>
                            <span className="shrink-0">${tax.toFixed(2)}</span>
                        </div>
                        <div className="mt-4 flex justify-between gap-3 border-t-2 border-brand-orange pt-4 text-base font-bold">
                            <span>Total:</span>
                            <span className="shrink-0 text-brand-orange">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-5">
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className="w-full rounded bg-brand-orange px-4 py-3 font-bold tracking-wider text-white transition-colors hover:bg-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            PLACE ORDER
                        </button>
                    </div>
                </aside>
            </form>
        </main>
    )
}

export default Assignment9