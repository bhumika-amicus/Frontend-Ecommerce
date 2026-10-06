import { Search } from 'lucide-react'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

interface ProductSearchProps {
  formClassName: string
  inputClassName: string
  buttonClassName: string
  placeholder: string
  iconSize?: number
}

function ProductSearch({
  formClassName,
  inputClassName,
  buttonClassName,
  placeholder,
  iconSize = 20,
}: ProductSearchProps) {
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const query = searchInput.trim()
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

  return (
    <form
      className={formClassName}
      onSubmit={handleSubmit}
      role="search"
    >
      <input
        type="search"
        placeholder={placeholder}
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        aria-label="Search products"
        className={inputClassName}
      />

      <button
        type="submit"
        className={buttonClassName}
        aria-label="Search"
      >
        <Search size={iconSize} />
      </button>
    </form>
  )
}

export default ProductSearch
