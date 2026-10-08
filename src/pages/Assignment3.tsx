import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function Assignment3() {
  return (
    <div className="mx-auto max-w-300 bg-white p-10 text-[#1a1a24]">
      <h1 className="mb-5 mt-0 text-center text-[28px] font-bold">
        Assignment 3 — Reusable Button & Card Library
      </h1>

      {/* Section A: Buttons */}
      <div className="mb-7.5 overflow-hidden rounded border border-[#e2e4e8]">
        <div className="bg-[#3b3e45] px-5 py-3.5 text-sm font-semibold tracking-[1px] text-white">
          SECTION A — BUTTON VARIANTS
        </div>

        <div className="flex flex-wrap items-start justify-evenly gap-5 px-5 py-10">
          <div className="flex flex-col items-center gap-4">
            <Button variant="primary" className="min-w-50">
              ORDER NOW
            </Button>
            <span className="text-sm text-[#555]">Primary</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button variant="secondary" className="min-w-50">
              VIEW MANUALS
            </Button>
            <span className="text-sm text-[#555]">Secondary</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button variant="outline" className="min-w-50">
              SEARCH
            </Button>
            <span className="text-sm text-[#555]">Outline</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button variant="danger" className="min-w-50">
              REMOVE
            </Button>
            <span className="text-sm text-[#555]">Danger</span>
          </div>
        </div>
      </div>

      {/* Section B: Cards */}
      <div className="mb-7.5 overflow-hidden rounded border border-[#e2e4e8]">
        <div className="bg-[#3b3e45] px-5 py-3.5 text-sm font-semibold tracking-[1px] text-white">
          SECTION B — CARD VARIANTS
        </div>

        <div className="flex flex-wrap items-start justify-evenly gap-5 px-5 py-10">
          <div className="flex flex-col items-center gap-4">
            <Card
              variant="elevated"
              className="w-80 gap-4 p-6 text-left"
            >
              <h2 className="m-0 text-xl font-semibold text-[#111]">
                Order Now
              </h2>

              <p className="m-0 mb-2 text-[15px] leading-[1.4] text-[#444]">
                Quickly place your order for parts.
              </p>

              <Button variant="primary">ORDER NOW</Button>
            </Card>

            <span className="text-sm text-[#555]">Elevated</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Card
              variant="bordered"
              className="w-80 gap-4 p-6 text-left"
            >
              <h2 className="m-0 text-xl font-semibold text-[#111]">
                Aftermarket Products
              </h2>

              <p className="m-0 mb-2 text-[15px] leading-[1.4] text-[#444]">
                Spare parts catalog.
              </p>

              <Button variant="primary">BROWSE PRODUCTS</Button>
            </Card>

            <span className="text-sm text-[#555]">Bordered</span>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Card
              variant="flat"
              className="w-80 gap-4 p-6 text-left"
            >
              <h2 className="m-0 text-xl font-semibold text-[#111]">
                Support
              </h2>

              <p className="m-0 mb-2 text-[15px] leading-[1.4] text-[#444]">
                Technical help center.
              </p>

              <Button variant="outline">CONTACT SUPPORT</Button>
            </Card>

            <span className="text-sm text-[#555]">Flat</span>
          </div>
        </div>
      </div>
    </div>
  )
}