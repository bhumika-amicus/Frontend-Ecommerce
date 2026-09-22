
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Column 1: Quick Links */}
        <div className="footer-col">
          <h4>QUICK LINKS</h4>
          <div className="footer-links">
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        {/* Column 2: Press Releases */}
        <div className="footer-col">
          <h4>PRESS RELEASES</h4>
          <div className="footer-links">
            <a href="#press">Press Releases</a>
          </div>
        </div>

        {/* Column 3: Newsletters */}
        <div className="footer-col">
          <h4>NEWSLETTERS</h4>
          <div className="footer-links">
            <a href="#direct-access">Direct Access</a>
          </div>
        </div>

        {/* Column 4: Company Info & Copyright */}
        <div className="footer-col footer-info">
          <p className="copyright">Copyright © 2026 JLG Industries</p>
          <p className="company-blurb">
            JLG Industries, Inc. is a leading manufacturer of mobile elevating work platforms and related access equipment. Its product portfolio includes aerial work platforms,
             telehandlers, and complementary accessories designed to support productivity and efficiency across a wide range of applications.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer