import { ChevronsRight, Globe, Info, LogIn, Menu, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductSearch from './ProductSearch'

function Header() {
  return (
    <header className="w-full border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex w-full max-w-360 flex-wrap justify-between items-center px-4.5 py-3 sm:px-6 md:h-17.5 md:flex-nowrap md:px-10 md:py-0">

        {/* Mobile Menu Toggle */}
        <button type="button" className="flex md:hidden items-center justify-center border-0 bg-transparent p-0 text-brand-orange transition-colors hover:text-brand-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2" aria-label="Menu">
          <Menu size={25} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center no-underline">
          <span className="text-2xl font-black tracking-tight text-[#ff5a00] italic">
            Trendify
          </span>
        </Link>

        {/* Search Bar */}
        <ProductSearch
          formClassName="order-4 mx-0 mt-3 flex h-10.5 w-full flex-none items-center overflow-hidden rounded border border-gray-300 bg-white transition-colors focus-within:border-brand-orange focus-within:ring-2 focus-within:ring-brand-orange/30 md:order-none md:mx-10 md:mt-0 md:max-w-150 md:flex-1"
          inputClassName="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          buttonClassName="flex h-full w-11.5 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none"
          placeholder="Search for products, brands and more"
          iconSize={20}
        />

        {/* Desktop navigation */}
        <nav className="ml-auto hidden items-center gap-7 md:flex">

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
        <div className="flex flex-nowrap items-center gap-2.5 sm:gap-3.5 md:hidden">


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