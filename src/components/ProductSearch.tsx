import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'

const styles = {
  header: {
    form: 'order-4 mx-0 mt-3 flex h-10.5 w-full flex-none items-center overflow-hidden rounded border border-gray-300 bg-white transition-colors focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/30 md:order-none md:mx-10 md:mt-0 md:max-w-150 md:flex-1',
    input: 'h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400',
    button: 'flex h-full w-11.5 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none'
  },
  hero: {
    form: 'mt-6 flex h-12 w-full max-w-[600px] items-center overflow-hidden rounded bg-white transition-colors focus-within:ring-2 focus-within:ring-brand-orange/30',
    input: 'h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-gray-700 outline-none placeholder:text-gray-400',
    button: 'flex h-full w-12 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none'
  }
}

interface ProductSearchProps {
  variant?: 'header' | 'hero'
  placeholder?: string
}

function ProductSearch({ variant = 'header', placeholder = 'Search' }: ProductSearchProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const committedSearch = searchParams.get('search') ?? ''
  const [searchInput, setSearchInput] = useState(committedSearch)

  const [prevCommittedSearch, setPrevCommittedSearch] = useState(committedSearch)
  if (committedSearch !== prevCommittedSearch) {
    setPrevCommittedSearch(committedSearch)
    setSearchInput(committedSearch)
  }

  const debouncedSearchTerm = useDebounce(searchInput, 350)

  function performSearch(query: string) {
    const isListingPage = location.pathname === '/products'

    // Preserve existing filters only when already on the listing page.
    const nextParams = new URLSearchParams(
      isListingPage ? searchParams : undefined,
    )

    if (query) {
      nextParams.set('search', query)
    } else {
      nextParams.delete('search')
    }

    // A new search starts from the first page.
    nextParams.set('page', '1')

    if (isListingPage) {
      setSearchParams(nextParams)
    } else {
      const queryString = nextParams.toString()
      navigate(
        queryString
          ? `/products?${queryString}`
          : '/products',
      )
    }
  }

  useEffect(() => {
    // Only search on type if we are already on the products page
    if (location.pathname !== '/products') return

    // Prevent searching if it matches the current URL (e.g. on mount)
    if (debouncedSearchTerm === (searchParams.get('search') ?? '')) return

    performSearch(debouncedSearchTerm.trim())
  }, [debouncedSearchTerm, location.pathname, searchParams])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    performSearch(searchInput.trim())
  }

  return (
    <form
      className={styles[variant].form}
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        placeholder={placeholder}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        aria-label="Search products"
        className={styles[variant].input}
      />

      <button
        type="submit"
        className={styles[variant].button}
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </form>
  )
}

export default ProductSearch
