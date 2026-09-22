import {
  ChevronsRight,
  Globe,
  Info,
  LogIn,
  Menu,
  Search,
  ShoppingCart,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
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

        {/* Desktop navigation */}
        <nav className="desktop-nav">
          <button type="button" className="header-icon-button" aria-label="Search">
            <Search size={22} />
          </button>

          <Link to="/assignment5" className="header-link">
            Categories
          </Link>

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