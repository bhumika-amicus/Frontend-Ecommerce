interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalized = (status || '').toLowerCase().trim();

  let badgeColor: string;
  let displayLabel: string;

  if (normalized === 'delivered') {
    badgeColor = 'bg-[#008a00] text-white';
    displayLabel = 'Delivered';
  } else if (normalized === 'shipped') {
    badgeColor = 'bg-[#0066ff] text-white';
    displayLabel = 'Shipped';
  } else if (normalized === 'cancelled') {
    badgeColor = 'bg-[#d32f2f] text-white';
    displayLabel = 'Cancelled';
  } else {
    badgeColor = 'bg-[#ff5a00] text-white';
    displayLabel = 'Processing';
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-4 py-1 text-xs font-semibold rounded-full shadow-sm capitalize tracking-wide ${badgeColor}`}
    >
      {displayLabel}
    </span>
  );
}
