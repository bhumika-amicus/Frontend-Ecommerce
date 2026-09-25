import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import Header from '../components/Header'
import './Assignment5.css'
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

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="product-listing">
                    <div className="product-listing-header">
                        <div>
                            <h1>Product Listing</h1>
                        </div>
                        <button className="button button-outline" disabled>
                            Refresh
                        </button>
                    </div>
                    <div className="product-listing-content">
                        <aside className="filter-sidebar">
                            <h2 className="mobile-filter-toggle" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
                                Filters <span className="toggle-icon">{isMobileFiltersOpen ? '▲' : '▼'}</span>
                            </h2>
                            <div className={`filter-content ${isMobileFiltersOpen ? 'open' : ''}`}>
                                <h3>CATEGORIES</h3>
                                <div className="empty-state empty-state-sidebar">Loading...</div>
                            </div>
                        </aside>
                        <section className="product-listing-products">
                            <div className="product-grid">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <ProductCardSkeleton key={index} />
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header />
                <main className="product-listing">
                    <div className="product-listing-header">
                        <div>
                            <h1>Product Listing</h1>
                        </div>
                    </div>
                    <div className="search-empty-state-full">
                        <div className="search-empty-state">
                            <h2>Oops! Something went wrong.</h2>
                            <p>We are having trouble connecting to our servers right now.</p>
                            <div className="search-tips">
                                <p>Troubleshooting Tips:</p>
                                <ul>
                                    <li>Check your internet connection</li>
                                    <li>Wait a moment and try again</li>
                                </ul>
                            </div>
                            <button className="button button-outline search-try-again-btn" onClick={() => { console.error(error); setRefreshCount(prev => prev + 1); }}>
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="product-listing">
                <div className="product-listing-header">
                    <div>
                        <h1>Product Listing</h1>

                    </div>
                    {sortedProducts.length > 0 && (
                        <button className="button button-outline" onClick={() => setRefreshCount(prev => prev + 1)}>
                            Refresh
                        </button>
                    )}
                </div>

                {products.length === 0 ? (
                    <div className="search-empty-state-full">
                        <div className="search-empty-state">
                            <h2>No products available.</h2>
                            <p>The store is currently empty. We might be restocking!</p>
                            <div className="search-tips">
                                <p>What to do next:</p>
                                <ul>
                                    <li>Check back later</li>
                                    <li>Contact support if you think this is a mistake</li>
                                </ul>
                            </div>
                            <button className="button button-outline search-try-again-btn" onClick={() => setRefreshCount(prev => prev + 1)}>
                                Refresh
                            </button>
                        </div>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="search-empty-state-full">
                        <div className="search-empty-state">
                            {searchTerm && selectedCategories.length > 0 ? (
                                <>
                                    <h2>No matches found</h2>
                                    <p>We couldn't find any products matching "{searchTerm}" in your selected categories.</p>
                                    <div className="search-tips">
                                        <p>Search Tips:</p>
                                        <ul>
                                            <li>Try clearing your category filters</li>
                                            <li>Select different categories</li>
                                        </ul>
                                    </div>
                                </>
                            ) : !searchTerm && selectedCategories.length > 0 ? (
                                <>
                                    <h2>No category matches</h2>
                                    <p>We couldn't find any products in your selected categories.</p>
                                    <div className="search-tips">
                                        <p>Search Tips:</p>
                                        <ul>
                                            <li>Select different categories</li>
                                            <li>Clear filters to view all products</li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>No Search Results</h2>
                                    <p>We could not find results for "{searchTerm}".</p>
                                    <div className="search-tips">
                                        <p>Search Tips:</p>
                                        <ul>
                                            <li>Check your spelling</li>
                                            <li>Enter a valid product name</li>
                                        </ul>
                                    </div>
                                </>
                            )}
                            <button
                                className="button button-outline search-try-again-btn"
                                onClick={() => {
                                    searchParams.delete('search');
                                    setSearchParams(searchParams);
                                    setSelectedCategories([]);
                                    setSortCategory(null);
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="product-listing-content">
                        <aside className="filter-sidebar">
                            <h2 className="mobile-filter-toggle" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
                                Filters <span className="toggle-icon">{isMobileFiltersOpen ? '▲' : '▼'}</span>
                            </h2>
                            <div className={`filter-content ${isMobileFiltersOpen ? 'open' : ''}`}>
                                <h3>CATEGORIES</h3>
                            <section className="filter-section">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => setSelectedCategories([])}
                                    />
                                    All
                                </label>

                                {productCategories.map((category) => (
                                    <label key={category}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                        />
                                        {category}
                                    </label>
                                ))}
                            </section>

                            <h3 className="sort-heading">Sort by</h3>
                            <section className="filter-section sort-options">

                                {/* NAME SORT */}
                                <div className={`sort-group ${sortCategory === 'name' ? 'active' : ''}`}>
                                    <label className="sort-main-label">
                                        <div>
                                            <input
                                                type="radio"
                                                checked={sortCategory === 'name'}
                                                onChange={() => setSortCategory('name')}
                                            />
                                            Name
                                        </div>
                                        {sortCategory === 'name' && (
                                            <button className="clear-sort" onClick={(e) => { e.preventDefault(); setSortCategory(null); }} aria-label="Clear sort">✕</button>
                                        )}
                                    </label>
                                    <div className={`sort-sub-options-wrapper ${sortCategory === 'name' ? 'open' : ''}`}>
                                        <div className="sort-sub-options">
                                            <div className="sort-sub-options-inner">
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                    A → Z
                                                </label>
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                    Z → A
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* PRICE SORT */}
                                <div className={`sort-group ${sortCategory === 'price' ? 'active' : ''}`}>
                                    <label className="sort-main-label">
                                        <div>
                                            <input
                                                type="radio"
                                                checked={sortCategory === 'price'}
                                                onChange={() => setSortCategory('price')}
                                            />
                                            Price
                                        </div>
                                        {sortCategory === 'price' && (
                                            <button className="clear-sort" onClick={(e) => { e.preventDefault(); setSortCategory(null); }} aria-label="Clear sort">✕</button>
                                        )}
                                    </label>
                                    <div className={`sort-sub-options-wrapper ${sortCategory === 'price' ? 'open' : ''}`}>
                                        <div className="sort-sub-options">
                                            <div className="sort-sub-options-inner">
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                    Low → High
                                                </label>
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                    High → Low
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* RATING SORT */}
                                <div className={`sort-group ${sortCategory === 'rating' ? 'active' : ''}`}>
                                    <label className="sort-main-label">
                                        <div>
                                            <input
                                                type="radio"
                                                checked={sortCategory === 'rating'}
                                                onChange={() => {
                                                    setSortCategory('rating');
                                                    setSortDirection('desc'); // Ratings default to High->Low usually
                                                }}
                                            />
                                            Ratings
                                        </div>
                                        {sortCategory === 'rating' && (
                                            <button className="clear-sort" onClick={(e) => { e.preventDefault(); setSortCategory(null); setSortDirection('asc'); }} aria-label="Clear sort">✕</button>
                                        )}
                                    </label>
                                    <div className={`sort-sub-options-wrapper ${sortCategory === 'rating' ? 'open' : ''}`}>
                                        <div className="sort-sub-options">
                                            <div className="sort-sub-options-inner">
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'desc'} onChange={() => setSortDirection('desc')} />
                                                    High → Low
                                                </label>
                                                <label>
                                                    <input type="radio" checked={sortDirection === 'asc'} onChange={() => setSortDirection('asc')} />
                                                    Low → High
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            </div>
                        </aside>

                        <section className="product-listing-products">
                            {searchTerm && (
                                <h3 className="search-results-count">
                                    Showing {sortedProducts.length} results for "{searchTerm}"
                                </h3>
                            )}
                            <ProductGrid
                                products={sortedProducts}
                                onAddToCart={handleAddToCart}
                            />
                        </section>
                    </div>
                )}
            </main>
        </>
    )
}

export default Assignment5