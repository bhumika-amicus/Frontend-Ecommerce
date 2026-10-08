import Button from '../ui/Button'
import Card from '../ui/Card'

function CategoryGrid() {
  return (
    <section className="mx-auto max-w-350 px-4 pt-15 pb-5 sm:px-6 md:px-10">
      <div className="mx-auto grid max-w-300 grid-cols-1 gap-4 min-[501px]:grid-cols-2 min-[1001px]:grid-cols-4">
        
        <Card
          variant="elevated"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              New Arrivals
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Check out the latest additions.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            SHOP NEW
          </Button>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Best Sellers
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Shop our most popular items.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            SHOP BEST SELLERS
          </Button>
        </Card>

        <Card
          variant="elevated"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Gift Cards
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Give the perfect gift to someone special.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            BUY GIFT CARDS
          </Button>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Sale Items
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Discover great deals on top products.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            SHOP SALE
          </Button>
        </Card>

      </div>
    </section>
  )
}

export default CategoryGrid