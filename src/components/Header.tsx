import {
  ChevronsRight,
  Globe,
  Info,
  LogIn,
  Menu,
  Search,
  ShoppingCart,
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Header.css'

function Header() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Keep the input in sync with the URL (handles browser back/forward buttons)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
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
    <header className="site-header">
      <div className="header-container">

        {/* Mobile Menu Toggle */}
        <button type="button" className="header-icon-button mobile-menu-toggle" aria-label="Menu">
          <Menu size={25} />
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/jlg-logo.png" alt="JLG" />
        </Link>

        {/* Search Bar */}
        <form className="header-search-form" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search by part number or keyword"
            value={searchInput}
            onChange={handleInputChange}
            className="header-search-input"
          />
          <button type="submit" className="header-search-button" aria-label="Search">
            <Search size={20} />
          </button>
        </form>

        {/* Desktop navigation */}
        <nav className="desktop-nav">

          <button type="button" className="header-link">
            <Globe size={18} />
            <span>English (United States)</span>
          </button>

          <button type="button" className="header-link">
            <span>Sign In</span>
            <LogIn size={18} />
          </button>

          <Link to="/cart" className="cart-link" aria-label="Shopping cart">
            <ShoppingCart size={22} />
            <span>0</span>
            <ChevronsRight size={18} />
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="mobile-actions">
          <button
            type="button"
            className="header-icon-button"
            aria-label="Search"
          >
            <Search size={25} />
          </button>

          <button
            type="button"
            className="header-icon-button"
            aria-label="Information"
          >
            <Info size={25} />
          </button>

          <Link
            to="/cart"
            className="mobile-cart"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={27} />
            <span>0</span>
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Header