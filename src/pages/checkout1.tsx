import { useState, useEffect } from 'react'
import { getCountries, getStates, getCities } from '../services/locationApi'
import './Checkout1.css'

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

function Checkout() {
    // --- 1. State Declarations ---
    const [formData, setFormData] = useState<ShippingFormData>(initialFormData)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [errors, setErrors] = useState<ShippingFormErrors>({})
    const [touched, setTouched] = useState<TouchedFields>({})
    const [countries, setCountries] = useState<string[]>([])
    const [states, setStates] = useState<{ name: string, state_code: string }[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isLoadingStates, setIsLoadingStates] = useState(false)
    const [isLoadingCities, setIsLoadingCities] = useState(false)

    // --- 2. Derived State ---
    const isFormValid = requiredFields.every((field) => validateField(field, formData[field]) === undefined)
    const shippingFee = formData.shippingMethod ? shippingRates[formData.shippingMethod] || 0 : 0
    const total = subtotal + shippingFee + tax

    // --- 3. Effects ---
    useEffect(() => {
        const controller = new AbortController()

        const fetchCountries = async () => {
            try {
                const countryNames = await getCountries(controller.signal)
                setCountries(countryNames)
            } catch (error: unknown) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Fetch countries aborted')
                } else {
                    console.error('Failed to fetch countries:', error)
                }
            }
        }

        fetchCountries()

        return () => {
            controller.abort()
        }
    }, [])

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

    const handleCountryChange = async (
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

        setStates([])
        setCities([])

        if (!country) return

        setIsLoadingStates(true)
        try {
            const statesData = await getStates(country)
            setStates(statesData)
        } catch (error) {
            console.error('Failed to fetch states:', error)
        } finally {
            setIsLoadingStates(false)
        }
    }

    const handleStateChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const state = e.target.value
        const country = formData.country

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

        setCities([])

        if (!state || !country) return

        setIsLoadingCities(true)
        try {
            const citiesData = await getCities(country, state)
            setCities(citiesData)
        } catch (error) {
            console.error('Failed to fetch cities:', error)
        } finally {
            setIsLoadingCities(false)
        }
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
        <main className="checkout-container">
            <h1>Checkout</h1>

            {isSubmitted && (
                <div className="success-message">
                    Order placed successfully!
                </div>
            )}

            <form className="checkout-layout" onSubmit={handleSubmit}>
                <section className="shipping-section">
                    <div className="section-header">SHIPPING INFORMATION</div>

                    <div className="shipping-content">
                        <div className="form-grid">
                            {/* Full Name */}
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.fullName && <p className="error">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && <p className="error">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.phone && <p className="error">{errors.phone}</p>}
                            </div>

                            {/* Street Address */}
                            <div className="form-group">
                                <label htmlFor="address">Street Address *</label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.address && <p className="error">{errors.address}</p>}
                            </div>

                            {/* Apt / Suite */}
                            <div className="form-group">
                                <label htmlFor="apartment">Apartment / Suite (Optional)</label>
                                <input
                                    id="apartment"
                                    name="apartment"
                                    type="text"
                                    value={formData.apartment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </div>

                            {/* City */}
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <select
                                    id="city"
                                    name="city"
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
                                {errors.city && <p className="error">{errors.city}</p>}
                            </div>

                            {/* State */}
                            <div className="form-group">
                                <label htmlFor="state">State / Province *</label>
                                <select
                                    id="state"
                                    name="state"
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
                                {errors.state && <p className="error">{errors.state}</p>}
                            </div>

                            {/* ZIP */}
                            <div className="form-group">
                                <label htmlFor="postalCode">ZIP / Postal Code *</label>
                                <input
                                    id="postalCode"
                                    name="postalCode"
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.postalCode && <p className="error">{errors.postalCode}</p>}
                            </div>

                            {/* Country */}
                            <div className="form-group">
                                <label htmlFor="country">Country *</label>
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleCountryChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Select country</option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                {errors.country && <p className="error">{errors.country}</p>}
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div className="shipping-method-section">
                            <h3>Shipping Method</h3>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <span>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="standard"
                                            checked={formData.shippingMethod === 'standard'}
                                            onChange={handleChange}
                                        />
                                        Standard Shipping (5-7 days)
                                    </span>
                                    <span>$5.00</span>
                                </label>
                                <label className="radio-label">
                                    <span>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="express"
                                            checked={formData.shippingMethod === 'express'}
                                            onChange={handleChange}
                                        />
                                        Express Shipping (2-3 days)
                                    </span>
                                    <span>$15.00</span>
                                </label>
                                <label className="radio-label">
                                    <span>
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="overnight"
                                            checked={formData.shippingMethod === 'overnight'}
                                            onChange={handleChange}
                                        />
                                        Overnight Shipping (1 day)
                                    </span>
                                    <span>$25.00</span>
                                </label>
                            </div>
                            {errors.shippingMethod && <p className="error">{errors.shippingMethod}</p>}
                        </div>
                    </div>
                </section>

                <aside className="order-summary">
                    <div className="section-header">ORDER SUMMARY</div>

                    <div className="order-items">
                        <div className="order-item">
                            <span>Wireless Headphones x2</span>
                            <span>$99.98</span>
                        </div>
                        <div className="order-item">
                            <span>Smart Watch Pro x1</span>
                            <span>$199.99</span>
                        </div>
                        <div className="order-item">
                            <span>USB-C Hub Adapter x3</span>
                            <span>$104.97</span>
                        </div>
                    </div>

                    <div className="order-totals">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>${shippingFee.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total:</span>
                            <span className="total-amount">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="submit-section">
                        <button type="submit" disabled={!isFormValid} className="place-order-btn">
                            PLACE ORDER
                        </button>
                    </div>
                </aside>
            </form>
        </main>
    )
}

export default Checkout