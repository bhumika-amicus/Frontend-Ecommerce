import { useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useFetch } from '../hooks/useFetch'

import ProductGrid from '../components/product/ProductGrid'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton'
import Header from '../components/layout/Header'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import StateMessage from '../components/ui/StateMessage'
import Pagination from '../components/ui/Pagination'
import FilterSidebar from '../components/product/FilterSidebar'
import { getBrands, getCategories, searchProducts } from '../services/productApi'
import { ProductSortBy, SortOrder } from '../types/ProductSorting'
import { getValidInt, getValidFloat } from '../utils/urlHelpers'

function ProductListing() {
    const [searchParams, setSearchParams] = useSearchParams()
    const searchTerm = searchParams.get('search') || ''
    const categoryId = getValidInt(searchParams, 'categoryId', 1)
    const brandId = getValidInt(searchParams, 'brandId', 1)
    const minRating = getValidFloat(searchParams, 'minRating', 1, 5)
    const page = getValidInt(searchParams, 'page', 1) ?? 1
    
    let minPrice = getValidFloat(searchParams, 'minPrice', 0)
    let maxPrice = getValidFloat(searchParams, 'maxPrice', 0)
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        minPrice = undefined
        maxPrice = undefined
    }

    const rawSortBy = searchParams.get('sortBy') as ProductSortBy
    const sortBy = Object.values(ProductSortBy).includes(rawSortBy) ? rawSortBy : undefined

    const rawSortOrder = searchParams.get('sortOrder') as SortOrder
    const sortOrder = Object.values(SortOrder).includes(rawSortOrder) ? rawSortOrder : undefined

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

    const {
        data: productsData,
        isLoading,
        error,
        refetch: refetchProducts,
    } = useFetch(
        (signal) =>
            searchProducts(
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
                signal
            ),
        [
            searchTerm,
            categoryId,
            brandId,
            minPrice,
            maxPrice,
            minRating,
            sortBy,
            sortOrder,
            page,
        ]
    )

    const products = productsData?.products || []
    const totalRecords = productsData?.totalRecords || 0
    const totalPages = productsData?.totalPages || 0

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useFetch(getCategories)

    const categories = categoriesData || []

    const {
        data: brandsData,
        isLoading: isBrandsLoading,
        error: brandsError,
    } = useFetch(getBrands)

    const brands = brandsData || []



    function clearAllFilters() {
        setSearchParams((currentParams) => {
            const nextParams = new URLSearchParams(currentParams)
            nextParams.delete('categoryId')
            nextParams.delete('brandId')
            nextParams.delete('minPrice')
            nextParams.delete('maxPrice')
            nextParams.delete('minRating')
            nextParams.delete('sortBy')
            nextParams.delete('sortOrder')
            nextParams.delete('page')
            return nextParams
        })
    }

    const hasActiveFilters = searchTerm !== '' || categoryId !== undefined || brandId !== undefined || minPrice !== undefined || maxPrice !== undefined || minRating !== undefined


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
                onAction={() => { console.error(error); refetchProducts(); }}
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
                onAction={() => refetchProducts()}
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
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Products' }]} />
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0">Product Listing</h1>
                    {isLoading ? (
                        <button className="button button-outline" disabled>
                            Refresh
                        </button>
                    ) : !error && products.length > 0 ? (
                        <button className="button button-outline" onClick={() => refetchProducts()}>
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
