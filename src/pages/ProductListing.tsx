import { type ReactNode, useMemo, useCallback } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useProductFilters } from '../hooks/useProductFilters'
import { usePageMeta } from '../hooks/usePageMeta'

import ProductGrid from '../components/product/ProductGrid'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import StateMessage from '../components/ui/StateMessage'
import Pagination from '../components/ui/Pagination'
import Button from '../components/ui/Button'
import FilterSidebar from '../components/product/FilterSidebar'
import { getBrands, getCategories, searchProducts } from '../services/productApi'
import type { Category } from '../types/Categories'
import type { Brand } from '../types/Brands'
import type { Product } from '../types/Products'

const PAGE_SIZE = 12
const EMPTY_PRODUCTS: Product[] = []
const EMPTY_CATEGORIES: Category[] = []
const EMPTY_BRANDS: Brand[] = []

function ProductListing() {
    usePageMeta(
        'Products',
        'Browse our complete catalog of electronics, lifestyle, and fashion products with instant filtering and search.'
    )
    const {
        searchTerm,
        page,
        hasActiveFilters,
        updatePage,
        apiParams,
        filterKey,
        resetAllFilters,
    } = useProductFilters()

    const {
        data: productsData,
        isLoading,
        error,
        refetch: refetchProducts,
    } = useFetch(
        (signal) => searchProducts({ ...apiParams, pageSize: PAGE_SIZE }, signal),
        [filterKey]
    )

    const products = useMemo(
        () => productsData?.products || EMPTY_PRODUCTS,
        [productsData]
    )
    const totalRecords = productsData?.totalRecords || 0
    const totalPages = productsData?.totalPages || 0

    const handleRetry = useCallback(() => {
        refetchProducts()
    }, [refetchProducts])

    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useFetch(getCategories)

    const categories = categoriesData || EMPTY_CATEGORIES

    const {
        data: brandsData,
        isLoading: isBrandsLoading,
        error: brandsError,
    } = useFetch(getBrands)

    const brands = brandsData || EMPTY_BRANDS

    let content: ReactNode

    if (isLoading) {
        content = (
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
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
                onAction={handleRetry}
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
    } else if (products.length === 0) {
        content = hasActiveFilters ? (
            <StateMessage
                title="No products match your criteria"
                message={
                    searchTerm
                        ? `We couldn't find any products matching "${searchTerm}". Try checking your spelling or clearing your filters.`
                        : "No products match the selected filters. Try broadening your criteria."
                }
                buttonText="Clear All Filters"
                onAction={resetAllFilters}
            />
        ) : (
            <StateMessage
                title="No products available."
                message="The store is currently empty. We might be restocking!"
                buttonText="Refresh"
                onAction={refetchProducts}
            />
        )
    } else {
        const startRecord = (page - 1) * PAGE_SIZE + 1
        const endRecord = Math.min(page * PAGE_SIZE, totalRecords)

        content = (
            <>
                <p className="mb-5 text-sm text-gray-600">
                    Showing {startRecord}–{endRecord} of {totalRecords} products
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
            <div className="p-6">
                <Breadcrumbs />
                <div className="flex items-center justify-between mb-3">
                    <h1 className="text-lg md:text-xl lg:text-2xl font-bold m-0">Product Listing</h1>
                    {isLoading ? (
                        <Button variant="outline" disabled>
                            Refresh
                        </Button>
                    ) : !error && products.length > 0 ? (
                        <Button variant="outline" onClick={refetchProducts}>
                            Refresh
                        </Button>
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
                    />
                    <section className="min-w-0">
                        {content}
                    </section>
                </div>
            </div>
        </>
    )
}

export default ProductListing
