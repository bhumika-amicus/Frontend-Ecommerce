import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import './Checkout2.css'

type ShippingMethod = '' | 'standard' | 'express' | 'overnight'

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
    shippingMethod: ShippingMethod
}

interface StateOption {
    name: string
    state_code: string
}

interface ApiResponse<T> {
    data: T
    error?: boolean
    msg?: string
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
    shippingMethod: '',
}

const apiBaseUrl = 'https://countriesnow.space/api/v0.1/countries'
const subtotal = 404.94
const tax = 32.4
const shippingRates: Record<Exclude<ShippingMethod, ''>, number> = {
    standard: 5,
    express: 15,
    overnight: 25,
}

async function postCountriesNow<T>(
    endpoint: string,
    values: Record<string, string>,
    signal: AbortSignal,
): Promise<T> {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(values),
        signal,
    })

    if (!response.ok) {
        throw new Error('Location data request failed')
    }

    const result = await response.json() as ApiResponse<T>
    if (result.error) {
        throw new Error(result.msg || 'Location data request failed')
    }

    return result.data
}

function CheckoutRHF() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [countries, setCountries] = useState<string[]>([])
    const [states, setStates] = useState<StateOption[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isLoadingCountries, setIsLoadingCountries] = useState(true)
    const [isLoadingStates, setIsLoadingStates] = useState(false)
    const [isLoadingCities, setIsLoadingCities] = useState(false)
    const [locationError, setLocationError] = useState('')
    const {
        control,
        register,
        handleSubmit,
        reset,
        resetField,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ShippingFormData>({
        defaultValues: initialFormData,
        mode: 'onTouched',
        reValidateMode: 'onChange'
    })
    const selectedCountry = useWatch({ control, name: 'country' })
    const selectedState = useWatch({ control, name: 'state' })
    const selectedShippingMethod = useWatch({ control, name: 'shippingMethod' })
    const shippingFee = selectedShippingMethod ? shippingRates[selectedShippingMethod] : 0
    const total = subtotal + tax + shippingFee

    useEffect(() => {
        const controller = new AbortController()

        const loadCountries = async () => {
            try {
                const response = await fetch(apiBaseUrl, { signal: controller.signal })
                if (!response.ok) throw new Error('Could not load countries')

                const result = await response.json() as ApiResponse<{ country: string }[]>
                if (result.error || !Array.isArray(result.data)) {
                    throw new Error(result.msg || 'Could not load countries')
                }

                setCountries(result.data.map(({ country }) => country))
            } catch {
                if (!controller.signal.aborted) {
                    setLocationError('Countries could not be loaded. Please try again later.')
                }
            } finally {
                if (!controller.signal.aborted) setIsLoadingCountries(false)
            }
        }

        void loadCountries()
        return () => controller.abort()
    }, [])

    useEffect(() => {
        const controller = new AbortController()

        if (!selectedCountry) {
            return () => controller.abort()
        }

        const loadStates = async () => {
            try {
                const result = await postCountriesNow<{ states?: StateOption[] }>(
                    'states',
                    { country: selectedCountry },
                    controller.signal,
                )
                setStates(result.states || [])
            } catch {
                if (!controller.signal.aborted) {
                    setLocationError('States could not be loaded. Please select the country again.')
                }
            } finally {
                if (!controller.signal.aborted) setIsLoadingStates(false)
            }
        }

        void loadStates()
        return () => controller.abort()
    }, [selectedCountry])

    useEffect(() => {
        const controller = new AbortController()

        if (!selectedCountry || !selectedState) {
            return () => controller.abort()
        }

        const loadCities = async () => {
            try {
                const result = await postCountriesNow<string[]>(
                    'state/cities',
                    { country: selectedCountry, state: selectedState },
                    controller.signal,
                )
                setCities(result)
            } catch {
                if (!controller.signal.aborted) {
                    setLocationError('Cities could not be loaded. Please select the state again.')
                }
            } finally {
                if (!controller.signal.aborted) setIsLoadingCities(false)
            }
        }

        void loadCities()
        return () => controller.abort()
    }, [selectedCountry, selectedState])

    return (
        <main className="checkout2-container">
            <h1>Checkout</h1>

            {isSubmitted && (
                <p className="success-message">
                    Order placed successfully!
                </p>
            )}

            <form
                className="checkout2-form"
                noValidate
                onChange={() => setIsSubmitted(false)}
                onSubmit={handleSubmit((formData) => {
                    console.log('Form Submitted', formData)
                    setIsSubmitted(true)
                    reset(initialFormData)
                })}
            >
                <div className="checkout2-layout">
                    <section className="shipping-section">
                        <div className="section-header">SHIPPING INFORMATION</div>
                        <div className="shipping-content">
                            {locationError && <p className="location-error">{locationError}</p>}
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name *</label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        className={errors.fullName ? 'input-error' : ''}
                                        {...register('fullName', {
                                            required: 'Full name is required',
                                            validate: (value) => {
                                                const trimmedValue = value.trim()
                                                if (!trimmedValue) return 'Full name is required'
                                                if (trimmedValue.length < 3) {
                                                    return 'Full name must be at least 3 characters'
                                                }
                                                if (trimmedValue.length > 50) {
                                                    return 'Full name must be 50 characters or less'
                                                }
                                                return true
                                            },
                                        })}
                                    />
                                    {errors.fullName?.message && <p className="error-message">{errors.fullName.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className={errors.email ? 'input-error' : ''}
                                        {...register('email', {
                                            required: 'Email is required',
                                            validate: (value) => {
                                                const trimmedValue = value.trim()
                                                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
                                                    return 'Enter a valid email address'
                                                }
                                                return true
                                            },
                                        })}
                                    />
                                    {errors.email?.message && <p className="error-message">{errors.email.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number *</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        className={errors.phone ? 'input-error' : ''}
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            validate: (value) => {
                                                if (!value.trim()) return 'Phone number is required'
                                                return /^\d{10}$/.test(value) || 'Phone number must contain exactly 10 digits'
                                            },
                                        })}
                                    />
                                    {errors.phone?.message && <p className="error-message">{errors.phone.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Street Address *</label>
                                    <input
                                        id="address"
                                        type="text"
                                        className={errors.address ? 'input-error' : ''}
                                        {...register('address', {
                                            required: 'Street address is required',
                                            validate: (value) => {
                                                const trimmedValue = value.trim()
                                                if (!trimmedValue) return 'Street address is required'
                                                if (trimmedValue.length < 10) {
                                                    return 'Street address must be at least 10 characters'
                                                }
                                                return true
                                            },
                                        })}
                                    />
                                    {errors.address?.message && <p className="error-message">{errors.address.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="apartment">Apartment / Suite (Optional)</label>
                                    <input
                                        id="apartment"
                                        type="text"
                                        {...register('apartment')}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <select
                                        id="city"
                                        className={errors.city ? 'input-error' : ''}
                                        disabled={!selectedState || isLoadingCities}
                                        {...register('city', { required: 'City is required' })}
                                    >
                                        <option value="">
                                            {isLoadingCities ? 'Loading cities...' : cities.length ? 'Select city' : 'Select a state first'}
                                        </option>
                                        {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                                    </select>
                                    {errors.city?.message && <p className="error-message">{errors.city.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State / Province *</label>
                                    <select
                                        id="state"
                                        className={errors.state ? 'input-error' : ''}
                                        disabled={!selectedCountry || isLoadingStates}
                                        {...register('state', {
                                            required: 'State is required',
                                            onChange: () => {
                                                resetField('city')
                                                setCities([])
                                                setIsLoadingCities(Boolean(selectedCountry))
                                                setLocationError('')
                                            },
                                        })}
                                    >
                                        <option value="">
                                            {isLoadingStates ? 'Loading states...' : states.length ? 'Select state' : 'Select a country first'}
                                        </option>
                                        {states.map(({ name, state_code }) => (
                                            <option key={`${name}-${state_code}`} value={name}>{name}</option>
                                        ))}
                                    </select>
                                    {errors.state?.message && <p className="error-message">{errors.state.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="postalCode">ZIP / Postal Code *</label>
                                    <input
                                        id="postalCode"
                                        type="text"
                                        inputMode="numeric"
                                        className={errors.postalCode ? 'input-error' : ''}
                                        {...register('postalCode', {
                                            required: 'ZIP code is required',
                                            validate: (value) => /^\d{5,6}$/.test(value) || 'ZIP code must contain 5–6 digits',
                                        })}
                                    />
                                    {errors.postalCode?.message && <p className="error-message">{errors.postalCode.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">Country *</label>
                                    <select
                                        id="country"
                                        className={errors.country ? 'input-error' : ''}
                                        disabled={isLoadingCountries}
                                        {...register('country', {
                                            required: 'Country is required',
                                            onChange: (event) => {
                                                const country = event.target.value as string
                                                resetField('state')
                                                resetField('city')
                                                setStates([])
                                                setCities([])
                                                setIsLoadingStates(Boolean(country))
                                                setIsLoadingCities(false)
                                                setLocationError('')
                                            },
                                        })}
                                    >
                                        <option value="">
                                            {isLoadingCountries ? 'Loading countries...' : 'Select country'}
                                        </option>
                                        {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                                    </select>
                                    {errors.country?.message && <p className="error-message">{errors.country.message}</p>}
                                </div>
                            </div>

                            <div className="shipping-method-section">
                                <h2>Shipping Method</h2>
                                <div className="radio-group">
                                    <label className="radio-label">
                                        <span><input type="radio" value="standard" {...register('shippingMethod', { required: 'Shipping method is required' })} />Standard Shipping (5-7 days)</span>
                                        <span>$5.00</span>
                                    </label>
                                    <label className="radio-label">
                                        <span><input type="radio" value="express" {...register('shippingMethod', { required: 'Shipping method is required' })} />Express Shipping (2-3 days)</span>
                                        <span>$15.00</span>
                                    </label>
                                    <label className="radio-label">
                                        <span><input type="radio" value="overnight" {...register('shippingMethod', { required: 'Shipping method is required' })} />Overnight Shipping (1 day)</span>
                                        <span>$25.00</span>
                                    </label>
                                </div>
                                {errors.shippingMethod?.message && <p className="error-message">{errors.shippingMethod.message}</p>}
                            </div>
                        </div>
                    </section>

                    <aside className="order-summary">
                        <div className="section-header">ORDER SUMMARY</div>
                        <div className="order-items">
                            <div className="order-item"><span>Wireless Headphones x2</span><span>$99.98</span></div>
                            <div className="order-item"><span>Smart Watch Pro x1</span><span>$199.99</span></div>
                            <div className="order-item"><span>USB-C Hub Adapter x3</span><span>$104.97</span></div>
                        </div>
                        <div className="order-totals">
                            <div className="summary-row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                            <div className="summary-row"><span>Shipping:</span><span>${shippingFee.toFixed(2)}</span></div>
                            <div className="summary-row"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
                            <div className="summary-total"><span>Total:</span><span className="total-amount">${total.toFixed(2)}</span></div>
                        </div>
                        <div className="submit-section">
                            <button type="submit" className="place-order-btn" disabled={!isValid || isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'PLACE ORDER'}
                            </button>
                        </div>
                    </aside>
                </div>
            </form>
        </main>
    )
}

export default CheckoutRHF