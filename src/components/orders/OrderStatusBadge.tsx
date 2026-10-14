import { CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

const STATUS_CONFIG: Record<
  string,
  { badgeColor: string; displayLabel: string; Icon: typeof Clock }
> = {
  delivered: {
    badgeColor: 'bg-[#008a00] text-white',
    displayLabel: 'Delivered',
    Icon: CheckCircle2,
  },
  shipped: {
    badgeColor: 'bg-[#0066ff] text-white',
    displayLabel: 'Shipped',
    Icon: Truck,
  },
  cancelled: {
    badgeColor: 'bg-[#d32f2f] text-white',
    displayLabel: 'Cancelled',
    Icon: XCircle,
  },
};

const DEFAULT_CONFIG = {
  badgeColor: 'bg-[#ff5a00] text-white',
  displayLabel: 'Processing',
  Icon: Clock,
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();
  const config = STATUS_CONFIG[normalized] || DEFAULT_CONFIG;
  const { badgeColor, displayLabel, Icon } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full shadow-sm capitalize tracking-wide ${badgeColor}`}
    >
      <Icon size={13} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
