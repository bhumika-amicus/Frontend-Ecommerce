function Footer() {
  return (
    <footer className="bg-[#f4f5f7] px-6 py-10 text-[#111111] md:px-12 md:py-15">
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-10 min-[769px]:grid-cols-2 min-[1025px]:grid-cols-[1fr_1fr_1fr_2fr] min-[1025px]:gap-10">
        
        {/* Column 1: Quick Links */}
        <div className="flex flex-col">
          <h4 className="m-0 mb-6 text-sm font-bold uppercase tracking-[0.5px]">
            QUICK LINKS
          </h4>

          <div className="flex flex-col gap-4">
            <a
              href="#products"
              className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
            >
              Products
            </a>

            <a
              href="#about"
              className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Column 2: Press Releases */}
        <div className="flex flex-col">
          <h4 className="m-0 mb-6 text-sm font-bold uppercase tracking-[0.5px]">
            PRESS RELEASES
          </h4>

          <div className="flex flex-col gap-4">
            <a
              href="#press"
              className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
            >
              Press Releases
            </a>
          </div>
        </div>

        {/* Column 3: Newsletters */}
        <div className="flex flex-col">
          <h4 className="m-0 mb-6 text-sm font-bold uppercase tracking-[0.5px]">
            NEWSLETTERS
          </h4>

          <div className="flex flex-col gap-4">
            <a
              href="#direct-access"
              className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
            >
              Direct Access
            </a>
          </div>
        </div>

        {/* Column 4: Company Info & Copyright */}
        <div className="flex flex-col text-[13px] leading-[1.6] text-[#333333]">
          <p className="m-0 mb-4">
            Copyright © 2026 JLG Industries
          </p>

          <p className="m-0 mb-6">
            JLG Industries, Inc. is a leading manufacturer of mobile elevating
            work platforms and related access equipment. Its product portfolio
            includes aerial work platforms, telehandlers, and complementary
            accessories designed to support productivity and efficiency across
            a wide range of applications.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer