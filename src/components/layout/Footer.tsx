const footerColumns = [
  {
    title: 'QUICK LINKS',
    links: [
      { text: 'Products', href: '#products' },
      { text: 'About', href: '#about' },
      { text: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'PRESS RELEASES',
    links: [
      { text: 'Press Releases', href: '#press' },
    ],
  },
  {
    title: 'NEWSLETTERS',
    links: [
      { text: 'Direct Access', href: '#direct-access' },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-[#f4f5f7] px-6 py-10 text-[#111111] md:px-12 md:py-15">
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-10 min-[769px]:grid-cols-2 min-[1025px]:grid-cols-[1fr_1fr_1fr_2fr] min-[1025px]:gap-10">

        {footerColumns.map((column) => (
          <div key={column.title} className="flex flex-col">
            <h4 className="m-0 mb-6 text-sm font-bold uppercase tracking-[0.5px]">
              {column.title}
            </h4>

            <div className="flex flex-col gap-4">
              {column.links.map((link) => (
                <a
                  key={link.text}
                  href={link.href}
                  className="text-sm font-semibold text-brand-orange no-underline transition-opacity duration-200 hover:text-[#333333] hover:opacity-80"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Column 4: Company Info & Copyright */}
        <div className="flex flex-col text-[13px] leading-[1.6] text-[#333333]">
          <p className="m-0 mb-4">
            Copyright © 2026 Trendify
          </p>

          <p className="m-0 mb-6">
            Trendify is your ultimate destination for the latest products across all categories. We bring you the most popular and trending items at unbeatable prices. Shop with confidence and elevate your lifestyle with our curated collections.
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer