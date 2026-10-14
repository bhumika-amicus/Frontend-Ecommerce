export default function CartItemSkeleton() {
  return (
    <div className="flex flex-col md:flex-row items-center border-b border-gray-200 py-6 gap-4 animate-pulse">
      {/* Product Info Skeleton */}
      <div className="flex items-center flex-1 w-full gap-4">
        <div className="h-24 w-24 bg-gray-200 shrink-0" />
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-20 mt-1" />
        </div>
      </div>

      {/* Unit Price Skeleton */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <div className="md:hidden h-4 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>

      {/* Quantity Skeleton */}
      <div className="w-full md:w-32 flex justify-between md:justify-center items-center">
        <div className="md:hidden h-4 bg-gray-200 rounded w-12" />
        <div className="h-9 bg-gray-200 rounded w-28" />
      </div>

      {/* Total Skeleton */}
      <div className="w-full md:w-32 flex justify-between md:justify-end items-center">
        <div className="md:hidden h-4 bg-gray-200 rounded w-14" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

