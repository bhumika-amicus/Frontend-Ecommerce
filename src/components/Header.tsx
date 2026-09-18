function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="/" className="logo">
          Trendify
        </a>

        <nav className="main-nav">
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  )
}

export default Header