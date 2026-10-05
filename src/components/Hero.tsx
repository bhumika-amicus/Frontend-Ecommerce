import ProductSearch from './ProductSearch'

function Hero() {
  return (
    <section className="relative w-full overflow-hidden aspect-auto min-h-100 md:aspect-[15/4] md:min-h-0">
      <img
        src="/hero.png"
        alt="Construction equipment"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-[50px] text-center text-white sm:px-16 sm:py-0">
        <h1 className="m-0 max-w-[700px] text-4xl font-bold uppercase leading-[1.1] md:text-5xl">
          Discover Top Products
        </h1>

        <ProductSearch
          formClassName="mt-6 flex h-12 w-full max-w-[600px] items-center overflow-hidden rounded bg-white transition-colors focus-within:ring-2 focus-within:ring-brand-orange/30"
          inputClassName="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base text-gray-700 outline-none placeholder:text-gray-400"
          buttonClassName="flex h-full w-12 shrink-0 items-center justify-center border-0 bg-transparent text-brand-orange transition-colors hover:bg-gray-50 focus-visible:outline-none"
          placeholder="Search"
          iconSize={20}
        />
      </div>
    </section>
  )
}

export default Hero