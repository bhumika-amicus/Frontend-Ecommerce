import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { ProductSortBy, SortOrder } from '../types/ProductSorting'
import type { Category } from '../types/Categories'
import type { Brand } from '../types/Brands'

interface FilterSidebarProps {
    categories: Category[]
    isCategoriesLoading: boolean
    categoriesError?: string | null
    brands: Brand[]
    isBrandsLoading: boolean
    brandsError?: string | null
    hasActiveFilters: boolean
    onClearAllFilters: () => void
}

function FilterSidebar({
    categories,
    isCategoriesLoading,
    categoriesError,
    brands,
    isBrandsLoading,
    brandsError,
    hasActiveFilters,
    onClearAllFilters,
}: FilterSidebarProps) {
    const [searchParams, setSearchParams] = useSearchParams()

    // Parse URL parameters relevant for the UI
    const selectedCategoryId = searchParams.has('categoryId') ? Number(searchParams.get('categoryId')) : undefined
    const brandId = searchParams.has('brandId') ? Number(searchParams.get('brandId')) : undefined
    const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const minRating = searchParams.has('minRating') ? Number(searchParams.get('minRating')) : undefined
    const sortBy = searchParams.get('sortBy') as ProductSortBy | undefined
    const sortOrder = searchParams.get('sortOrder') as SortOrder | undefined

    // Mobile toggle states
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)
    const [isBrandOpen, setIsBrandOpen] = useState(false)
    const [isPriceOpen, setIsPriceOpen] = useState(false)
    const [isRatingOpen, setIsRatingOpen] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)

    // Updater functions
    function updatePriceRange(nextMinPrice: number | undefined, nextMaxPrice: number | undefined) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (nextMinPrice === undefined) nextParams.delete('minPrice')
            else nextParams.set('minPrice', String(nextMinPrice))

            if (nextMaxPrice === undefined) nextParams.delete('maxPrice')
            else nextParams.set('maxPrice', String(nextMaxPrice))

            nextParams.set('page', '1')
            return nextParams
        })
    }

    function updateMinRating(nextRating: number | undefined) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            if (nextRating === undefined) nextParams.delete('minRating')
            else nextParams.set('minRating', String(nextRating))

            nextParams.set('page', '1')
            return nextParams
        })
    }

    function updateSort(nextSortBy: ProductSortBy, nextSortOrder: SortOrder) {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            nextParams.set('sortBy', nextSortBy)
            nextParams.set('sortOrder', nextSortOrder)
            nextParams.set('page', '1')
            return nextParams
        })
    }

    function clearSort() {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            nextParams.delete('sortBy')
            nextParams.delete('sortOrder')
            nextParams.set('page', '1')
            return nextParams
        })
    }

    return (
        <aside className="sticky top-0 z-10 border border-gray-300 bg-white p-3 lg:top-6 overflow-y-auto max-h-screen lg:max-h-[calc(100vh-3rem)]">
            <button
                type="button"
                className="flex w-full cursor-pointer items-center justify-between border-b-2 border-brand-orange-500 bg-transparent p-0 pb-2 text-left text-lg md:text-xl font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 lg:hidden"
                aria-expanded={isMobileFiltersOpen}
                aria-controls="listing-filter-content"
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
                FILTERS
                <span aria-hidden="true">{isMobileFiltersOpen ? '▲' : '▼'}</span>
            </button>
            <h2 className="hidden lg:block m-0 pb-2 mb-4 border-b-2 border-brand-orange-500 font-bold uppercase tracking-wide text-gray-800">
                FILTERS
            </h2>
            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClearAllFilters}
                    className="mb-4 w-full rounded border border-brand-orange-500 px-3 py-2 text-sm font-semibold text-brand-orange-600 transition-colors hover:bg-brand-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                >
                    Clear all filters
                </button>
            )}

            <div
                id="listing-filter-content"
                className={`lg:block ${isMobileFiltersOpen ? 'block mt-5' : 'hidden'}`}
            >
                <button
                    type="button"
                    onClick={() => setIsCategoryOpen((open) => !open)}
                    aria-expanded={isCategoryOpen}
                    className="flex w-full items-center justify-between lg:hidden m-0 mb-2 text-base font-bold text-gray-800"
                >
                    <span>Category</span>
                    <span aria-hidden="true">{isCategoryOpen ? '▲' : '▼'}</span>
                </button>
                <h3 className="hidden lg:block m-0 mb-2 text-base font-bold text-gray-800">Category</h3>
                <section className={`${isCategoryOpen ? 'block' : 'hidden'} lg:block`}>
                    {isCategoriesLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="mb-2 flex items-center gap-1.5 px-1 py-0.5">
                                <div className="h-3 w-3 rounded-sm bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                            </div>
                        ))
                    ) : categoriesError ? (
                        <p className="text-sm text-red-500 py-1 italic">{categoriesError}</p>
                    ) : categories.length === 0 ? (
                        <p className="text-sm text-gray-500 py-1 italic">No categories found.</p>
                    ) : (
                        <>
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
                                >
                                    <input
                                        type="checkbox"
                                        className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                        checked={selectedCategoryId === category.id}
                                        onChange={() => {
                                            setSearchParams((currentParams) => {
                                                const nextParams = new URLSearchParams(currentParams)
                                                if (selectedCategoryId === category.id) {
                                                    nextParams.delete('categoryId')
                                                } else {
                                                    nextParams.set('categoryId', String(category.id))
                                                }
                                                nextParams.set('page', '1')
                                                return nextParams
                                            })
                                        }}
                                    />
                                    {category.name}
                                </label>
                            ))}
                        </>
                    )}
                </section>

                <button
                    type="button"
                    onClick={() => setIsBrandOpen((open) => !open)}
                    aria-expanded={isBrandOpen}
                    className="flex w-full items-center justify-between lg:hidden m-0 mb-2 mt-5 text-base font-bold text-gray-800"
                >
                    <span>Brand</span>
                    <span aria-hidden="true">{isBrandOpen ? '▲' : '▼'}</span>
                </button>
                <h3 className="hidden lg:block m-0 mb-2 mt-5 text-base font-bold text-gray-800">Brand</h3>
                <section className={`${isBrandOpen ? 'block' : 'hidden'} lg:block`}>
                    {isBrandsLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="mb-2 flex items-center gap-1.5 px-1 py-0.5">
                                <div className="h-3 w-3 rounded-sm bg-gray-200 animate-pulse"></div>
                                <div className="h-4 w-24 rounded bg-gray-200 animate-pulse"></div>
                            </div>
                        ))
                    ) : brandsError ? (
                        <p className="text-sm text-red-500 py-1 italic">{brandsError}</p>
                    ) : brands.length === 0 ? (
                        <p className="text-sm text-gray-500 py-1 italic">No brands found.</p>
                    ) : (
                        brands.map((brand) => (
                            <label
                                key={brand.id}
                                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={brandId === brand.id}
                                    onChange={() => {
                                        setSearchParams((currentParams) => {
                                            const nextParams = new URLSearchParams(currentParams)
                                            if (brandId === brand.id) {
                                                nextParams.delete('brandId')
                                            } else {
                                                nextParams.set('brandId', String(brand.id))
                                            }
                                            nextParams.set('page', '1')
                                            return nextParams
                                        })
                                    }}
                                />
                                {brand.name}
                            </label>
                        ))
                    )}
                </section>

                <button
                    type="button"
                    onClick={() => setIsPriceOpen((open) => !open)}
                    aria-expanded={isPriceOpen}
                    className="flex w-full items-center justify-between lg:hidden m-0 mb-2 mt-5 text-base font-bold text-gray-800"
                >
                    <span>Price</span>
                    <span aria-hidden="true">{isPriceOpen ? '▲' : '▼'}</span>
                </button>
                <h3 className="hidden lg:block m-0 mb-2 mt-5 text-base font-bold text-gray-800">Price</h3>
                <section className={`${isPriceOpen ? 'block' : 'hidden'} lg:block`}>
                    {[
                        { label: 'Below ₹10,000', min: undefined, max: 10000 },
                        { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
                        { label: 'Above ₹50,000', min: 50000, max: undefined },
                    ].map((range, index) => {
                        const isChecked = minPrice === range.min && maxPrice === range.max
                        return (
                            <label
                                key={index}
                                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={isChecked}
                                    onChange={() => {
                                        if (isChecked) {
                                            updatePriceRange(undefined, undefined)
                                        } else {
                                            updatePriceRange(range.min, range.max)
                                        }
                                    }}
                                />
                                {range.label}
                            </label>
                        )
                    })}
                </section>

                <button
                    type="button"
                    onClick={() => setIsRatingOpen((open) => !open)}
                    aria-expanded={isRatingOpen}
                    className="flex w-full items-center justify-between lg:hidden m-0 mb-2 mt-5 text-base font-bold text-gray-800"
                >
                    <span>Rating</span>
                    <span aria-hidden="true">{isRatingOpen ? '▲' : '▼'}</span>
                </button>
                <h3 className="hidden lg:block m-0 mb-2 mt-5 text-base font-bold text-gray-800">Rating</h3>
                <section className={`${isRatingOpen ? 'block' : 'hidden'} lg:block`}>
                    {[
                        { label: '1 star & above', value: 1 },
                        { label: '2 stars & above', value: 2 },
                        { label: '3 stars & above', value: 3 },
                        { label: '4 stars & above', value: 4 },
                    ].map((rating, index) => {
                        const isChecked = minRating === rating.value
                        return (
                            <label
                                key={index}
                                className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={isChecked}
                                    onChange={() => {
                                        if (isChecked) {
                                            updateMinRating(undefined)
                                        } else {
                                            updateMinRating(rating.value)
                                        }
                                    }}
                                />
                                <div className="flex flex-col gap-1 mt-0.5">
                                    <span>{rating.label}</span>
                                    <span className="flex items-center text-brand-orange-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                                key={i} 
                                                className={`h-3 w-3 ${i < rating.value ? 'fill-current' : 'text-gray-300'}`} 
                                            />
                                        ))}
                                    </span>
                                </div>
                            </label>
                        )
                    })}
                </section>

                <button
                    type="button"
                    onClick={() => setIsSortOpen((open) => !open)}
                    aria-expanded={isSortOpen}
                    className="flex w-full items-center justify-between lg:hidden m-0 mb-2 mt-5 text-base font-bold text-gray-800"
                >
                    <span>Sort by</span>
                    <span aria-hidden="true">{isSortOpen ? '▲' : '▼'}</span>
                </button>
                <h3 className="hidden lg:block m-0 mb-2 mt-5 text-base font-bold text-gray-800">Sort by</h3>
                <section className={`flex-col ${isSortOpen ? 'flex' : 'hidden'} lg:flex`}>
                    <div className="flex flex-col">
                        <div
                            className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-brand-orange-50 ${sortBy === ProductSortBy.Name
                                ? 'bg-brand-orange-50 font-medium text-brand-orange-600'
                                : ''
                                }`}
                        >
                            <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                <input
                                    type="radio"
                                    name="sort-category"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={sortBy === ProductSortBy.Name}
                                    onChange={() => updateSort(ProductSortBy.Name, SortOrder.Asc)}
                                />
                                Name
                            </label>
                            {sortBy === ProductSortBy.Name && (
                                <button
                                    type="button"
                                    className="cursor-pointer rounded border-0 bg-transparent px-1 text-brand-orange-600 font-bold transition-colors hover:bg-brand-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    onClick={clearSort}
                                    aria-label="Clear sort"
                                >✕</button>
                            )}
                        </div>
                        <div
                            aria-hidden={sortBy !== ProductSortBy.Name}
                            inert={sortBy !== ProductSortBy.Name}
                            className={`overflow-hidden transition-all duration-200 ${sortBy === ProductSortBy.Name ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div>
                                <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-brand-orange-500 pl-3">
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600" >
                                        <input type="radio" name="sort-direction-name" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Name && sortOrder === SortOrder.Asc} onChange={() => updateSort(ProductSortBy.Name, SortOrder.Asc)} />
                                        A → Z
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600" >
                                        <input type="radio" name="sort-direction-name" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Name && sortOrder === SortOrder.Desc} onChange={() => updateSort(ProductSortBy.Name, SortOrder.Desc)} />
                                        Z → A
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div
                            className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-brand-orange-50 ${sortBy === ProductSortBy.Price
                                ? 'bg-brand-orange-50 font-medium text-brand-orange-600'
                                : ''
                                }`}
                        >
                            <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                <input
                                    type="radio"
                                    name="sort-category"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={sortBy === ProductSortBy.Price}
                                    onChange={() => updateSort(ProductSortBy.Price, SortOrder.Asc)}
                                />
                                Price
                            </label>
                            {sortBy === ProductSortBy.Price && (
                                <button
                                    type="button"
                                    className="cursor-pointer rounded border-0 bg-transparent px-1 text-brand-orange-600 font-bold transition-colors hover:bg-brand-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    onClick={clearSort}
                                    aria-label="Clear sort"
                                >✕</button>
                            )}
                        </div>
                        <div
                            aria-hidden={sortBy !== ProductSortBy.Price}
                            inert={sortBy !== ProductSortBy.Price}
                            className={`overflow-hidden transition-all duration-200 ${sortBy === ProductSortBy.Price ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div>
                                <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-brand-orange-500 pl-3">
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                        <input type="radio" name="sort-direction-price" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Price && sortOrder === SortOrder.Asc} onChange={() => updateSort(ProductSortBy.Price, SortOrder.Asc)} />
                                        Low → High
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                        <input type="radio" name="sort-direction-price" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Price && sortOrder === SortOrder.Desc} onChange={() => updateSort(ProductSortBy.Price, SortOrder.Desc)} />
                                        High → Low
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div
                            className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-brand-orange-50 ${sortBy === ProductSortBy.Rating
                                ? 'bg-brand-orange-50 font-medium text-brand-orange-600'
                                : ''
                                }`}
                        >
                            <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                <input
                                    type="radio"
                                    name="sort-category"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={sortBy === ProductSortBy.Rating}
                                    onChange={() => updateSort(ProductSortBy.Rating, SortOrder.Desc)}
                                />
                                Ratings
                            </label>
                            {sortBy === ProductSortBy.Rating && (
                                <button
                                    type="button"
                                    className="cursor-pointer rounded border-0 bg-transparent px-1 text-brand-orange-600 font-bold transition-colors hover:bg-brand-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    onClick={clearSort}
                                    aria-label="Clear sort"
                                >✕</button>
                            )}
                        </div>
                        <div
                            aria-hidden={sortBy !== ProductSortBy.Rating}
                            inert={sortBy !== ProductSortBy.Rating}
                            className={`overflow-hidden transition-all duration-200 ${sortBy === ProductSortBy.Rating ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div>
                                <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-brand-orange-500 pl-3">
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                        <input type="radio" name="sort-direction-rating" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Rating && sortOrder === SortOrder.Desc} onChange={() => updateSort(ProductSortBy.Rating, SortOrder.Desc)} />
                                        High → Low
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                        <input type="radio" name="sort-direction-rating" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortBy === ProductSortBy.Rating && sortOrder === SortOrder.Asc} onChange={() => updateSort(ProductSortBy.Rating, SortOrder.Asc)} />
                                        Low → High
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </aside>
    )
}

export default FilterSidebar
