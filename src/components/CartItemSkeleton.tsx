function CartItemSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4 animate-pulse">
      <div className="flex items-center flex-1 w-full gap-4">
        <div className="h-24 w-24 bg-gray-200"></div>
        <div className="flex flex-col gap-3 w-1/2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-16 mt-1"></div>
        </div>
      </div>
      <div className="w-full md:w-32 flex justify-end md:justify-center items-center">
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-full md:w-32 flex justify-end md:justify-center items-center">
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
      <div className="w-full md:w-32 flex justify-end items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}

export default CartItemSkeleton
