import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';

interface OrderEmptyStateProps {
  message?: string;
  tabName?: string;
}

export default function OrderEmptyState({
  message = 'No orders yet. Start shopping!',
  tabName,
}: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded border border-dashed border-gray-200 bg-white shadow-sm my-6">
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-brand-orange mb-4 shadow-inner">
        <PackageOpen size={32} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {message}
      </h3>

      <p className="text-sm text-gray-500 max-w-md mb-6">
        {tabName && tabName !== 'All Orders'
          ? `You have no ${tabName.toLowerCase()} orders at the moment.`
          : 'Looks like you have not placed any orders yet. Discover our latest products and exclusive deals!'}
      </p>

      <Link
        to="/products"
        className="inline-flex items-center gap-2 bg-[#ff5a00] hover:bg-[#e65100] text-white font-bold text-xs uppercase px-6 py-3 rounded tracking-wider transition-colors shadow-sm"
      >
        <span>START SHOPPING</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
