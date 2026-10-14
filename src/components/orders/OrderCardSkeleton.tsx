export default function OrderCardSkeleton() {
  return (
    <div className="rounded border border-gray-200 bg-white p-5 animate-pulse space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="h-5 w-44 bg-gray-200 rounded" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="space-y-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-28 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="w-12 h-12 bg-gray-200 rounded" />
          <div className="w-12 h-12 bg-gray-200 rounded" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
