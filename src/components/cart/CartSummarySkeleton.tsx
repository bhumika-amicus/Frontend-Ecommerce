export default function CartSummarySkeleton() {
  return (
    <div className="w-full lg:w-80 xl:w-96 self-start lg:sticky lg:top-6 animate-pulse">
      <div className="border border-gray-200 bg-white shadow-sm">
        <div className="bg-gray-900 text-white font-bold py-3 px-6 tracking-wider">
          ORDER SUMMARY
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-36" />
              <div className="h-4 bg-gray-200 rounded w-12" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-14" />
            </div>
          </div>

          <hr className="border-gray-200 my-6" />

          <div className="flex justify-between items-center mb-8">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-7 bg-gray-200 rounded w-24" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-11 bg-gray-200 rounded w-full" />
            <div className="h-11 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

