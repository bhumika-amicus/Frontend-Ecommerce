import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import Header from '../components/Header'
import { getProducts } from '../services/api'

function Assignment5() {
    const [products, setProducts] = useState<Product[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshCount, setRefreshCount] = useState(0)

    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [sortCategory, setSortCategory] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''

    const fetchProducts = async (signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)

        try {
            const transformedProducts = await getProducts(signal)

            setProducts(transformedProducts)
            setIsLoading(false)
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return
            }

            console.error("API Error:", error)

            setError(error instanceof Error ? error.message : 'An unexpected error occurred.'
            )

            setIsLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        console.log('Fetching products from API...')
        fetchProducts(controller.signal)

        return () => {
            controller.abort()
        }
    }, [refreshCount])

    const productCategories = [...new Set(products.map((product) => product.category)),]

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return matchesSearch && matchesCategory;
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortCategory === 'name') {
            return sortDirection === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name)
        }
        if (sortCategory === 'price') {
            return sortDirection === 'asc' ? a.price - b.price : b.price - a.price
        }
        if (sortCategory === 'rating') {
            const ratingA = a.rating ?? 0;
            const ratingB = b.rating ?? 0;
            return sortDirection === 'asc' ? ratingA - ratingB : ratingB - ratingA
        }
        return 0
    })



    const handleAddToCart = (product: Product) => {
        console.log(`Added product ${product.id}: ${product.name}`)
    }

    const toggleCategory = (category: string) => {
        setSelectedCategories((previousCategories) =>
            previousCategories.includes(category)
                ? previousCategories.filter((item) => item !== category)
                : [...previousCategories, category]
        )
    }

    let content: ReactNode

    if (isLoading) {
        content = (
            <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[180px_1fr]">
                <aside className="border border-gray-300 bg-white p-3 lg:sticky lg:top-6">
                    {/* Mobile Header */}
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between border-b-2 border-orange-500 bg-transparent p-0 pb-2 text-left text-lg md:text-xl font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 lg:hidden"
                        aria-expanded={isMobileFiltersOpen}
                        aria-controls="listing-filter-content"
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    >
                        FILTERS
                        <span aria-hidden="true">{isMobileFiltersOpen ? '▲' : '▼'}</span>
                    </button>
                    {/* Desktop Header */}
                    <h2 className="hidden lg:block m-0 pb-2 mb-4 border-b-2 border-orange-500 font-bold uppercase tracking-wide text-gray-800">
                        FILTERS
                    </h2>
                    <div
                        id="listing-filter-content"
                        className={`lg:block ${isMobileFiltersOpen
                            ? 'block mt-5'
                            : 'hidden'
                            }`}
                    >
                        <div className="p-5 text-center text-gray-500">Loading...</div>
                    </div>
                </aside>
                <section className="min-w-0">
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </section>
            </div>
        )
    } else if (error) {
        content = (
            <div className="mt-7.5 flex w-full items-start justify-center">
                <div className="flex w-full max-w-125 flex-col items-center p-5 text-center">
                    <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
                        Oops! Something went wrong.
                    </h2>
                    <p className="mb-6 text-base text-gray-600">
                        We are having trouble connecting to our servers right now.
                    </p>
                    <div className="inline-block text-left">
                        <p className="mb-2 font-medium">Troubleshooting Tips:</p>
                        <ul className="ml-5 list-disc text-gray-600">
                            <li className="mb-1.5 text-base">Check your internet connection</li>
                            <li className="mb-1.5 text-base">Wait a moment and try again</li>
                        </ul>
                    </div>
                    <button className="button button-outline mt-8" onClick={() => { console.error(error); setRefreshCount(prev => prev + 1); }}>
                        Try Again
                    </button>
                </div>
            </div>
        )
    } else if (products.length === 0) {
        content = (
            <div className="mt-7.5 flex w-full items-start justify-center">
                <div className="flex w-full max-w-125 flex-col items-center p-5 text-center">

                    <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
                        No products available.
                    </h2>

                    <p className="mb-6 text-base text-gray-600">
                        The store is currently empty. We might be restocking!
                    </p>

                    <div className="inline-block text-left">
                        <p className="mb-2 font-medium">
                            What to do next:
                        </p>

                        <ul className="ml-5 list-disc text-gray-600">
                            <li className="mb-1.5 text-base">
                                Check back later
                            </li>
                            <li className="mb-1.5 text-base">
                                Contact support if you think this is a mistake
                            </li>
                        </ul>
                    </div>

                    <button
                        className="button button-outline mt-8"
                        onClick={() => setRefreshCount(prev => prev + 1)}
                    >
                        Refresh
                    </button>

                </div>
            </div>
        )
    } else if (sortedProducts.length === 0) {
        content = (
            <div className="mt-7.5 flex w-full items-start justify-center">
                <div className="flex w-full max-w-125 flex-col items-center p-5 text-center">
                    {searchTerm && selectedCategories.length > 0 ? (
                        <>
                            <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700" >No matches found</h2>
                            <p className="mb-6 text-base text-gray-600">
                                We couldn't find any products matching "{searchTerm}" in your selected categories.</p>

                            <div className="inline-block text-left">
                                <p className="mb-2 font-medium" >Search Tips:</p>
                                <ul className="ml-5 list-disc text-gray-600" >
                                    <li className="mb-1.5 text-base">Try clearing your category filters</li>
                                    <li className="mb-1.5 text-base" >Select different categories</li>
                                </ul>
                            </div>
                        </>
                    ) : !searchTerm && selectedCategories.length > 0 ? (
                        <>
                            <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
                                No category matches
                            </h2>

                            <p className="mb-6 text-base text-gray-600">
                                We couldn't find any products in your selected categories.
                            </p>

                            <div className="inline-block text-left">
                                <p className="mb-2 font-medium">
                                    Search Tips:
                                </p>

                                <ul className="ml-5 list-disc text-gray-600">
                                    <li className="mb-1.5 text-base">
                                        Select different categories
                                    </li>
                                    <li className="mb-1.5 text-base">
                                        Clear filters to view all products
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-6 text-lg md:text-xl lg:text-2xl font-bold text-gray-700">
                                No Search Results
                            </h2>

                            <p className="mb-6 text-base text-gray-600">
                                We could not find results for "{searchTerm}".
                            </p>

                            <div className="inline-block text-left">
                                <p className="mb-2 font-medium">
                                    Search Tips:
                                </p>

                                <ul className="ml-5 list-disc text-gray-600">
                                    <li className="mb-1.5 text-base">
                                        Check your spelling
                                    </li>
                                    <li className="mb-1.5 text-base">
                                        Enter a valid product name
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                    <button
                        className="button button-outline mt-8"
                        onClick={() => {
                            setSearchParams((params) => {
                                params.delete('search')
                                return params
                            });
                            setSelectedCategories([]);
                            setSortCategory(null);
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    } else {
        content = (
            <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[180px_1fr]">
                <aside className="border border-gray-300 bg-white p-3 lg:sticky lg:top-6">

                    {/* Mobile Header */}
                    <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between border-b-2 border-orange-500 bg-transparent p-0 pb-2 text-left text-lg md:text-xl font-bold uppercase tracking-wide text-gray-800 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 lg:hidden"
                        aria-expanded={isMobileFiltersOpen}
                        aria-controls="listing-filter-content"
                        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                    >
                        FILTERS
                        <span aria-hidden="true">{isMobileFiltersOpen ? '▲' : '▼'}</span>
                    </button>
                    {/* Desktop Header */}
                    <h2 className="hidden lg:block m-0 pb-2 mb-4 border-b-2 border-orange-500 font-bold uppercase tracking-wide text-gray-800">
                        FILTERS
                    </h2>

                    <div
                        id="listing-filter-content"
                        className={`lg:block ${isMobileFiltersOpen
                            ? 'block mt-5'
                            : 'hidden'
                            }`}
                    >
                        <h3 className="m-0 mb-2 text-base font-bold text-gray-800">
                            Category
                        </h3>
                        <section>
                            <label className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900">
                                <input
                                    type="checkbox"
                                    className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                    checked={selectedCategories.length === 0}
                                    onChange={() => setSelectedCategories([])}
                                />
                                All
                            </label>

                            {productCategories.map((category) => (
                                <label key={category}
                                    className="mb-2 flex cursor-pointer items-center gap-1.5 rounded px-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
                                >
                                    <input
                                        type="checkbox"
                                        className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                    />
                                    {category}
                                </label>
                            ))}
                        </section>

                        <h3 className="m-0 mb-2 mt-5 text-base font-bold text-gray-800">Sort by</h3>
                        <section className="flex flex-col">

                            {/* NAME SORT */}
                            <div className="flex flex-col">
                                <div
                                    className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-orange-50 ${sortCategory === 'name'
                                        ? 'bg-orange-50 font-medium text-orange-600'
                                        : ''
                                        }`}
                                >
                                    <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                        <input
                                            type="radio"
                                            name="sort-category"
                                            className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            checked={sortCategory === 'name'}
                                            onChange={() => setSortCategory('name')}
                                        />
                                        Name
                                    </label>
                                    {sortCategory === 'name' && (
                                        <button
                                            type="button"
                                            className="cursor-pointer rounded border-0 bg-transparent px-1 text-orange-600 font-bold transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            onClick={() => setSortCategory(null)}
                                            aria-label="Clear sort"
                                        >✕</button>
                                    )}
                                </div>
                                <div
                                    aria-hidden={sortCategory !== 'name'}
                                    inert={sortCategory !== 'name'}
                                    className={`overflow-hidden transition-all duration-200 ${sortCategory === 'name' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div>
                                        <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-orange-500 pl-3">
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600" >
                                                <input type="radio" name="sort-direction-name" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                A → Z
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600" >
                                                <input type="radio" name="sort-direction-name" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                Z → A
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PRICE SORT */}
                            <div className="flex flex-col">
                                <div
                                    className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-orange-50 ${sortCategory === 'price'
                                        ? 'bg-orange-50 font-medium text-orange-600'
                                        : ''
                                        }`}
                                >
                                    <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                        <input
                                            type="radio"
                                            name="sort-category"
                                            className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            checked={sortCategory === 'price'}
                                            onChange={() => setSortCategory('price')}
                                        />
                                        Price
                                    </label>
                                    {sortCategory === 'price' && (
                                        <button
                                            type="button"
                                            className="cursor-pointer rounded border-0 bg-transparent px-1 text-orange-600 font-bold transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            onClick={() => setSortCategory(null)}
                                            aria-label="Clear sort"
                                        >✕</button>
                                    )}
                                </div>
                                <div
                                    aria-hidden={sortCategory !== 'price'}
                                    inert={sortCategory !== 'price'}
                                    className={`overflow-hidden transition-all duration-200 ${sortCategory === 'price' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div>
                                        <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-orange-500 pl-3">
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                                <input type="radio" name="sort-direction-price" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                Low → High
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                                <input type="radio" name="sort-direction-price" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                High → Low
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RATING SORT */}
                            <div className="flex flex-col">
                                <div
                                    className={`mb-2 flex items-center justify-between rounded px-1 text-sm text-gray-600 transition-colors hover:bg-orange-50 ${sortCategory === 'rating'
                                        ? 'bg-orange-50 font-medium text-orange-600'
                                        : ''
                                        }`}
                                >
                                    <label className="flex flex-1 cursor-pointer items-center gap-1.5 rounded">
                                        <input
                                            type="radio"
                                            name="sort-category"
                                            className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            checked={sortCategory === 'rating'}
                                            onChange={() => {
                                                setSortCategory('rating');
                                                setSortDirection('desc'); // Ratings default to High->Low usually
                                            }}
                                        />
                                        Ratings
                                    </label>
                                    {sortCategory === 'rating' && (
                                        <button
                                            type="button"
                                            className="cursor-pointer rounded border-0 bg-transparent px-1 text-orange-600 font-bold transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                                            onClick={() => { setSortCategory(null); setSortDirection('asc'); }}
                                            aria-label="Clear sort"
                                        >✕</button>
                                    )}
                                </div>
                                <div
                                    aria-hidden={sortCategory !== 'rating'}
                                    inert={sortCategory !== 'rating'}
                                    className={`overflow-hidden transition-all duration-200 ${sortCategory === 'rating' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div>
                                        <div className="ml-5 mt-2 flex flex-col gap-2 border-l-2 border-orange-500 pl-3">
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                                <input type="radio" name="sort-direction-rating" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                High → Low
                                            </label>
                                            <label className="flex cursor-pointer items-center gap-1.5 rounded text-sm text-gray-600">
                                                <input type="radio" name="sort-direction-rating" className="accent-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                Low → High
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </aside>

                <section className="min-w-0">
                    {searchTerm && (
                        <h3 className="mb-5 font-semibold">
                            Showing {sortedProducts.length} results for "{searchTerm}"
                        </h3>
                    )}
                    <ProductGrid
                        products={sortedProducts}
                        onAddToCart={handleAddToCart}
                    />
                    <nav className="mt-6 flex justify-center" aria-label="Product pagination">
                        <ul className="m-0 flex max-w-full flex-wrap list-none items-center justify-center gap-1 p-0 sm:gap-2">
                            <li>
                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex h-8 items-center justify-center rounded-sm px-2 text-xs font-medium text-brand-orange transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                                >
                                    Previous
                                </button>
                            </li>
                            {[1, 2, 3, 4, 5].map((page) => (
                                <li key={page}>
                                    <button
                                        type="button"
                                        aria-current={page === 1 ? 'page' : undefined}
                                        aria-label={page === 1 ? `Page ${page}, current page` : `Page ${page}`}
                                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 ${page === 1
                                            ? 'bg-brand-orange text-white hover:bg-brand-orange-hover'
                                            : 'text-gray-700 hover:bg-orange-50 hover:text-brand-orange'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    className="inline-flex h-8 items-center justify-center rounded-sm px-2 text-xs font-medium text-brand-orange transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </section>
            </div>
        )
    }

    return (
        <>
            <Header />
            <main className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0">Product Listing</h1>
                    {isLoading ? (
                        <button className="button button-outline" disabled>
                            Refresh
                        </button>
                    ) : !error && sortedProducts.length > 0 ? (
                        <button className="button button-outline" onClick={() => setRefreshCount(prev => prev + 1)}>
                            Refresh
                        </button>
                    ) : null}
                </div>
                {content}
            </main>
        </>
    )
}

export default Assignment5
