const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

/**
 * Formats a numeric amount to Indian Rupee (INR) currency format.
 * Example: 12999 -> "₹12,999.00"
 */
export const formatINR = (amount: number): string => inrFormatter.format(amount);
