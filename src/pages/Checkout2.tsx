import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import Header from '../components/Header'
import Breadcrumbs from '../components/Breadcrumbs'
import CheckoutSteps from '../components/CheckoutSteps'

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

interface CheckoutRHFProps {
    cartCount?: number
}

function CheckoutRHF({ cartCount = 0 }: CheckoutRHFProps) {
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
        <>
            <Header cartCount={cartCount} />

            <main className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[50vh]">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Cart', path: '/cart' }, { label: 'Checkout' }]} />

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                    Checkout
                </h1>

                <CheckoutSteps currentStep={1} />

                {isSubmitted && (
                    <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 mb-6">
                        Order placed successfully!
                    </div>
                )}

                <form
                    className="flex flex-col lg:flex-row gap-8"
                    noValidate
                    onChange={() => setIsSubmitted(false)}
                    onSubmit={handleSubmit((formData) => {
                        console.log('Form Submitted', formData)
                        setIsSubmitted(true)
                        reset(initialFormData)
                    })}
                >
                    <div className="flex-1">
                        <section className="border border-gray-200 bg-white shadow-sm mb-6">
                            <div className="bg-[#1a1a1a] text-white font-bold py-3 px-6 tracking-wider uppercase">
                                SHIPPING INFORMATION
                            </div>
                            <div className="p-6">
                                {locationError && <p className="text-red-500 mb-4">{locationError}</p>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name *</label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            className={`h-10 px-3 border rounded text-sm focus-visible:outline-brand-orange ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.fullName?.message && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</label>
                                        <input
                                            id="email"
                                            type="email"
                                            className={`h-10 px-3 border rounded text-sm focus-visible:outline-brand-orange ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.email?.message && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number *</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            className={`h-10 px-3 border rounded text-sm focus-visible:outline-brand-orange ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                            {...register('phone', {
                                                required: 'Phone number is required',
                                                validate: (value) => {
                                                    if (!value.trim()) return 'Phone number is required'
                                                    return /^\d{10}$/.test(value) || 'Phone number must contain exactly 10 digits'
                                                },
                                            })}
                                        />
                                        {errors.phone?.message && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address *</label>
                                        <input
                                            id="address"
                                            type="text"
                                            className={`h-10 px-3 border rounded text-sm focus-visible:outline-brand-orange ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.address?.message && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="apartment" className="text-sm font-medium text-gray-700">Apartment / Suite (Optional)</label>
                                        <input
                                            id="apartment"
                                            type="text"
                                            className="h-10 px-3 border border-gray-300 rounded text-sm focus-visible:outline-brand-orange"
                                            {...register('apartment')}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="city" className="text-sm font-medium text-gray-700">City *</label>
                                        <select
                                            id="city"
                                            className={`h-10 px-3 border rounded text-sm bg-white focus-visible:outline-brand-orange disabled:bg-gray-100 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                                            disabled={!selectedState || isLoadingCities}
                                            {...register('city', { required: 'City is required' })}
                                        >
                                            <option value="">
                                                {isLoadingCities ? 'Loading cities...' : cities.length ? 'Select city' : 'Select a state first'}
                                            </option>
                                            {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                        {errors.city?.message && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="state" className="text-sm font-medium text-gray-700">State / Province *</label>
                                        <select
                                            id="state"
                                            className={`h-10 px-3 border rounded text-sm bg-white focus-visible:outline-brand-orange disabled:bg-gray-100 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.state?.message && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="postalCode" className="text-sm font-medium text-gray-700">ZIP / Postal Code *</label>
                                        <input
                                            id="postalCode"
                                            type="text"
                                            inputMode="numeric"
                                            className={`h-10 px-3 border rounded text-sm focus-visible:outline-brand-orange ${errors.postalCode ? 'border-red-500' : 'border-gray-300'}`}
                                            {...register('postalCode', {
                                                required: 'ZIP code is required',
                                                validate: (value) => /^\d{5,6}$/.test(value) || 'ZIP code must contain 5–6 digits',
                                            })}
                                        />
                                        {errors.postalCode?.message && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</label>
                                        <select
                                            id="country"
                                            className={`h-10 px-3 border rounded text-sm bg-white focus-visible:outline-brand-orange disabled:bg-gray-100 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
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
                                        {errors.country?.message && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">Shipping Method</h2>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                            <span className="flex items-center gap-3 text-sm text-gray-700">
                                                <input type="radio" value="standard" className="text-brand-orange focus:ring-brand-orange" {...register('shippingMethod', { required: 'Shipping method is required' })} />
                                                Standard Shipping (5-7 days)
                                            </span>
                                            <span className="text-sm text-gray-500">$5.00</span>
                                        </label>
                                        <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                            <span className="flex items-center gap-3 text-sm text-gray-700">
                                                <input type="radio" value="express" className="text-brand-orange focus:ring-brand-orange" {...register('shippingMethod', { required: 'Shipping method is required' })} />
                                                Express Shipping (2-3 days)
                                            </span>
                                            <span className="text-sm text-gray-500">$15.00</span>
                                        </label>
                                        <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                                            <span className="flex items-center gap-3 text-sm text-gray-700">
                                                <input type="radio" value="overnight" className="text-brand-orange focus:ring-brand-orange" {...register('shippingMethod', { required: 'Shipping method is required' })} />
                                                Overnight Shipping (1 day)
                                            </span>
                                            <span className="text-sm text-gray-500">$25.00</span>
                                        </label>
                                    </div>
                                    {errors.shippingMethod?.message && <p className="text-red-500 text-xs mt-2">{errors.shippingMethod.message}</p>}
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="w-full lg:w-80 xl:w-96">
                        <div className="border border-gray-200 bg-white shadow-sm">
                            <div className="bg-[#1a1a1a] text-white font-bold py-3 px-6 tracking-wider uppercase">
                                ORDER SUMMARY
                            </div>
                            <div className="p-6">
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600"><span>Wireless Headphones x2</span><span>$99.98</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Smart Watch Pro x1</span><span>$199.99</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>USB-C Hub Adapter x3</span><span>$104.97</span></div>
                                </div>
                                
                                <hr className="border-gray-200 mb-6" />

                                <div className="flex flex-col gap-3 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Shipping:</span><span>${shippingFee.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-sm text-gray-600"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
                                </div>

                                <hr className="border-gray-200 mb-6" />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-bold text-xl text-gray-800">Total:</span>
                                    <span className="font-bold text-2xl text-[#ff6b00]">${total.toFixed(2)}</span>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-[#ff5a00] hover:bg-[#e65c00] text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider" 
                                    disabled={!isValid || isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'PLACE ORDER'}
                                </button>
                            </div>
                        </div>
                    </aside>
                </form>
            </main>
        </>
    )
}

export default CheckoutRHF