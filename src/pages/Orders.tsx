import Breadcrumbs from '../components/ui/Breadcrumbs'

export default function Orders() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full min-h-[50vh]">
      <Breadcrumbs />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        My Orders
      </h1>
      <p className="text-gray-600">Your orders will appear here.</p>
    </div>
  )
}
