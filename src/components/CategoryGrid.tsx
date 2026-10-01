import Button from './Button'
import Card from './Card'

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
              Order Now
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Already know your part number?
            </p>
          </div>

          <Button variant="primary" className="w-full">
            ORDER NOW
          </Button>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Aftermarket Products
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Browse through our parts catalog.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            AFTERMARKET PRODUCTS
          </Button>
        </Card>

        <Card
          variant="elevated"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Interactive Parts Manuals
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Find the right parts in our interactive manuals.
            </p>
          </div>

          <Button variant="primary" className="w-full">
            VIEW MANUALS
          </Button>
        </Card>

        <Card
          variant="flat"
          className="p-6 min-[501px]:p-8 min-[1001px]:p-10"
        >
          <div className="flex grow flex-col gap-6">
            <h3 className="m-0 text-[28px] font-bold leading-[1.2]">
              Technical Publications
            </h3>

            <p className="m-0 mb-2.5 text-[15px] leading-[1.4] text-[#444444]">
              Download schematics, forms and manuals (Parts, Operation, Service and Supplemental).
            </p>
          </div>

          <Button variant="primary" className="w-full">
            SEARCH PUBLICATIONS
          </Button>
        </Card>

      </div>
    </section>
  )
}

export default CategoryGrid