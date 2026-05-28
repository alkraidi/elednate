export function formatPrice(amountMinor: number, currency = 'USD'): string {
  const value = amountMinor / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCaratWeight(tcw: string): string {
  return `${tcw} TCW`;
}
