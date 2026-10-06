import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { Product } from '../types/Products'
import ProductGrid from '../components/ProductGrid'
import ProductCardSkeleton from '../components/ProductCardSkeleton'
import Header from '../components/Header'
import StateMessage from '../components/StateMessage'
import Pagination from '../components/Pagination'
import FilterSidebar from '../components/FilterSidebar'
import { getBrands, getCategories, searchProducts } from '../services/api'
import { ProductSortBy, SortOrder } from '../types/ProductSorting'
import type { Category } from '../types/Categories'
import type { Brand } from '../types/Brands'

function ProductListing() {
    const [products, setProducts] = useState<Product[]>([])
    const [totalRecords, setTotalRecords] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [refreshCount, setRefreshCount] = useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''
    const rawCategoryId = searchParams.get('categoryId')
    const parsedCategoryId = rawCategoryId === null
        ? undefined
        : Number(rawCategoryId)

    const categoryId =
        parsedCategoryId !== undefined &&
            Number.isInteger(parsedCategoryId) &&
            parsedCategoryId > 0
            ? parsedCategoryId
            : undefined

    const rawBrandId = searchParams.get('brandId')
    const parsedBrandId = rawBrandId === null
        ? undefined
        : Number(rawBrandId)

    const brandId =
        parsedBrandId !== undefined &&
            Number.isInteger(parsedBrandId) &&
            parsedBrandId > 0
            ? parsedBrandId
            : undefined

    const rawSortBy = searchParams.get('sortBy')

    const rawMinPrice = searchParams.get('minPrice')
    const rawMaxPrice = searchParams.get('maxPrice')
    const rawMinRating = searchParams.get('minRating')

    const parsedMinPrice =
        rawMinPrice !== null && rawMinPrice.trim() !== ''
            ? Number(rawMinPrice)
            : undefined

    const parsedMaxPrice =
        rawMaxPrice !== null && rawMaxPrice.trim() !== ''
            ? Number(rawMaxPrice)
            : undefined

    const parsedMinRating =
        rawMinRating !== null && rawMinRating.trim() !== ''
            ? Number(rawMinRating)
            : undefined

    const hasValidMinPrice =
        parsedMinPrice !== undefined &&
        Number.isFinite(parsedMinPrice) &&
        parsedMinPrice >= 0

    const hasValidMaxPrice =
        parsedMaxPrice !== undefined &&
        Number.isFinite(parsedMaxPrice) &&
        parsedMaxPrice >= 0

    const hasValidPriceRange =
        (parsedMinPrice === undefined || hasValidMinPrice) &&
        (parsedMaxPrice === undefined || hasValidMaxPrice) &&
        !(
            parsedMinPrice !== undefined &&
            parsedMaxPrice !== undefined &&
            parsedMinPrice > parsedMaxPrice
        )

    const minPrice = hasValidPriceRange ? parsedMinPrice : undefined
    const maxPrice = hasValidPriceRange ? parsedMaxPrice : undefined

    const minRating =
        parsedMinRating !== undefined &&
            Number.isFinite(parsedMinRating) &&
            parsedMinRating >= 1 &&
            parsedMinRating <= 5
            ? parsedMinRating
            : undefined

    const sortBy =
        rawSortBy === ProductSortBy.Name ||
            rawSortBy === ProductSortBy.Price ||
            rawSortBy === ProductSortBy.Rating
            ? rawSortBy
            : undefined


    const rawSortOrder = searchParams.get('sortOrder')

    const sortOrder =
        rawSortOrder === SortOrder.Asc ||
            rawSortOrder === SortOrder.Desc
            ? rawSortOrder
            : undefined

    const rawPage = searchParams.get('page')
    const parsedPage = rawPage === null ? 1 : Number(rawPage)

    const page =
        Number.isInteger(parsedPage) && parsedPage > 0
            ? parsedPage
            : 1

    const pageSize = 12

    function updatePage(nextPage: number) {
        if (nextPage < 1 || nextPage > totalPages) {
            return
        }

        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            nextParams.set('page', String(nextPage))
            return nextParams
        })
    }

    const [categories, setCategories] = useState<Category[]>([])
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
    const [categoriesError, setCategoriesError] = useState<string | null>(null)

    const [brands, setBrands] = useState<Brand[]>([])
    const [isBrandsLoading, setIsBrandsLoading] = useState(true)
    const [brandsError, setBrandsError] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        async function fetchProducts() {
            setIsLoading(true)
            setError(null)

            try {
                const result = await searchProducts(
                    {
                        search: searchTerm,
                        categoryId,
                        brandId,
                        minPrice,
                        maxPrice,
                        minRating,
                        sortBy,
                        sortOrder,
                        page,
                        pageSize,
                    },
                    controller.signal
                )

                setProducts(result.products)
                setTotalRecords(result.totalRecords)
                setTotalPages(result.totalPages)
                setIsLoading(false)
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return
                }

                console.error('API Error:', error)

                setError(
                    error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.'
                )

                setIsLoading(false)
            }
        }

        fetchProducts()

        return () => {
            controller.abort()
        }
    }, [
        refreshCount,
        searchTerm,
        categoryId,
        brandId,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        sortOrder,
        page,
    ])

    useEffect(() => {
        setCategoriesError(null)
        getCategories()
            .then(setCategories)
            .catch((error) => {
                console.error('Failed to load categories:', error)
                setCategoriesError('Failed to load categories.')
            })
            .finally(() => setIsCategoriesLoading(false))
    }, [refreshCount])

    useEffect(() => {
        setBrandsError(null)
        getBrands()
            .then(setBrands)
            .catch((error) => {
                console.error('Failed to load brands:', error)
                setBrandsError('Failed to load brands.')
            })
            .finally(() => setIsBrandsLoading(false))
    }, [refreshCount])


    const handleAddToCart = (product: Product) => {
        console.log(`Added product ${product.id}: ${product.name}`)
    }



    function clearAllFilters() {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            nextParams.delete('search')
            nextParams.delete('categoryId')
            nextParams.delete('brandId')
            nextParams.delete('minPrice')
            nextParams.delete('maxPrice')
            nextParams.delete('minRating')
            nextParams.delete('page')
            return nextParams
        })
    }

    const hasActiveFilters = Boolean(searchTerm) || categoryId !== undefined || brandId !== undefined || minPrice !== undefined || maxPrice !== undefined || minRating !== undefined


    let content: ReactNode

    if (isLoading) {
        content = (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        )
    } else if (error) {
        content = (
            <StateMessage
                title="Oops! Something went wrong."
                message="We are having trouble connecting to our servers right now."
                buttonText="Try Again"
                onAction={() => { console.error(error); setRefreshCount(prev => prev + 1); }}
            >
                <div className="inline-block text-left">
                    <p className="mb-2 font-medium">Troubleshooting Tips:</p>
                    <ul className="ml-5 list-disc text-gray-600">
                        <li className="mb-1.5 text-base">Check your internet connection</li>
                        <li className="mb-1.5 text-base">Wait a moment and try again</li>
                    </ul>
                </div>
            </StateMessage>
        )
    } else if (products.length === 0 && hasActiveFilters) {
        content = (
            <StateMessage
                title="No products match your filters"
                message="Try adjusting your search or filters to find what you're looking for."
            />
        )
    } else if (products.length === 0) {
        content = (
            <StateMessage
                title="No products available."
                message="The store is currently empty. We might be restocking!"
                buttonText="Refresh"
                onAction={() => setRefreshCount(prev => prev + 1)}
            />
        )
    } else {
        content = (
            <>
                <p className="mb-5 text-sm text-gray-600">
                    Showing {products.length} of {totalRecords} products
                    {searchTerm && ` for "${searchTerm}"`}
                </p>
                <ProductGrid
                    products={products}
                    onAddToCart={handleAddToCart}
                />
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={updatePage}
                />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="p-6">
                <nav aria-label="Breadcrumb" className="mb-6 text-sm">
                    <ol className="flex items-center gap-3">
                        <li>
                            <Link
                                to="/"
                                className="font-semibold text-brand-orange-600 hover:text-brand-orange-700"
                            >
                                Home
                            </Link>
                        </li>

                        <li aria-hidden="true" className="text-gray-400">
                            »
                        </li>

                        <li aria-current="page" className="text-gray-600">
                            Products
                        </li>
                    </ol>
                </nav>
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0">Product Listing</h1>
                    {isLoading ? (
                        <button className="button button-outline" disabled>
                            Refresh
                        </button>
                    ) : !error && products.length > 0 ? (
                        <button className="button button-outline" onClick={() => setRefreshCount(prev => prev + 1)}>
                            Refresh
                        </button>
                    ) : null}
                </div>
                <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-[180px_1fr]">
                    <FilterSidebar
                        categories={categories}
                        isCategoriesLoading={isCategoriesLoading}
                        categoriesError={categoriesError}
                        brands={brands}
                        isBrandsLoading={isBrandsLoading}
                        brandsError={brandsError}
                        hasActiveFilters={hasActiveFilters}
                        onClearAllFilters={clearAllFilters}
                    />
                    <section className="min-w-0">
                        {content}
                    </section>
                </div>
            </main>
        </>
    )
}

export default ProductListing
