import { ChevronsRight, Globe, Info, LogIn, Menu, Search, ShoppingCart, } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { ComponentProps } from 'react'

type HeaderFormSubmitEvent = Parameters<NonNullable<ComponentProps<'form'>['onSubmit']>>[0]

function Header() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Keep the input in sync with the URL (handles browser back/forward buttons)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: HeaderFormSubmitEvent) => {
    e.preventDefault();
    const query = searchInput.trim();

    if (window.location.pathname === '/assignment5') {
      // We are already on the listing page. Safely update ONLY the search param.
      if (query) {
        searchParams.set('search', query);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    } else {
      // We are on Home or another page. Navigate to the listing page.
      navigate(query ? `/assignment5?search=${encodeURIComponent(query)}` : '/assignment5');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // If we are on the product listing page, update the URL as they type!
    if (window.location.pathname === '/assignment5') {
      const query = value.trim();
      if (query) {
        searchParams.set('search', query);
      } else {
        searchParams.delete('search');
      }
      // replace: true ensures the browser Back button works flawlessly
      setSearchParams(searchParams, { replace: true });
    }
  };

  return (
    <header className="w-full border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex h-17.5 w-full max-w-360 flex-nowrap items-center px-10 max-md:h-auto max-md:flex-wrap max-md:justify-between max-md:px-6 max-md:py-3 max-[500px]:px-4.5 max-[500px]:py-0">

        {/* Mobile Menu Toggle */}
        <button type="button" className="hidden items-center justify-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 max-md:flex" aria-label="Menu">
          <Menu size={25} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center no-underline">
          <img className="block h-auto w-28.75 max-md:w-28 max-[500px]:w-27" src="/jlg-logo.png" alt="JLG" />
        </Link>

        {/* Search Bar */}
        <form className="mx-10 flex h-10.5 w-full max-w-150 flex-1 items-center overflow-hidden rounded border border-gray-300 bg-white transition-colors focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/30 max-md:order-4 max-md:mx-0 max-md:mt-3 max-md:max-w-none max-md:flex-none" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search by part number or keyword"
            value={searchInput}
            onChange={handleInputChange}
            aria-label="Search products"
            className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          <button type="submit" className="flex h-full w-11.5 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none" aria-label="Search">
            <Search size={20} />
          </button>
        </form>

        {/* Desktop navigation */}
        <nav className="ml-auto flex items-center gap-7 max-md:hidden">

          <button type="button" className="flex cursor-pointer items-center gap-1.75 border-0 bg-transparent text-sm text-gray-600 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
            <Globe size={18} />
            <span>English (United States)</span>
          </button>

          <button type="button" className="flex cursor-pointer items-center gap-1.75 border-0 bg-transparent text-sm text-gray-600 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
            <span>Sign In</span>
            <LogIn size={18} />
          </button>

          <Link to="/cart" className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 no-underline transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" aria-label="Shopping cart">
            <ShoppingCart size={22} />
            <span>0</span>
            <ChevronsRight size={18} />
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="hidden flex-nowrap items-center gap-3.5 max-md:flex max-[500px]:gap-2.5">


          <button
            type="button"
            className="flex items-center justify-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            aria-label="Information"
          >
            <Info size={25} />
          </button>

          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-brand-orange no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={27} />
            <span className="text-xl font-semibold">0</span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Header