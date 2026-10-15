import Breadcrumbs from '../common/Breadcrumbs';

export default function CheckoutSkeleton() {
  return (
    <div className="mx-auto min-h-[50vh] w-full max-w-7xl px-3 py-4 sm:px-5 md:px-8">
      <Breadcrumbs />
      <div className="h-8 w-44 bg-gray-200 animate-pulse rounded mb-6"></div>
      <div className="h-12 bg-gray-100 animate-pulse rounded mb-8"></div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)] xl:gap-8">
        <div className="h-96 bg-gray-50 border border-gray-200 animate-pulse rounded-lg p-6"></div>
        <div className="h-72 bg-gray-50 border border-gray-200 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}
