import { OrderFilterTab } from '../../types/OrderDto';

interface OrderFilterTabsProps {
  activeTab: OrderFilterTab;
  onTabChange: (tab: OrderFilterTab) => void;
  counts?: Record<OrderFilterTab, number>;
}

const TABS: OrderFilterTab[] = [
  OrderFilterTab.All,
  OrderFilterTab.Processing,
  OrderFilterTab.Shipped,
  OrderFilterTab.Delivered,
  OrderFilterTab.Cancelled,
];

export default function OrderFilterTabs({ activeTab, onTabChange }: OrderFilterTabsProps) {
  return (
    <div className="w-full border-b border-gray-200 pb-3 mb-6 overflow-x-auto">
      <div className="flex items-center gap-2 sm:gap-4 min-w-max">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2 text-sm font-semibold rounded transition-all duration-150 ${
                isActive
                  ? 'bg-[#ff5a00] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
}
