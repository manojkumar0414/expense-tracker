// Format rupees to currency
export function formatCurrency(rupees) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(rupees);
}

// Parse Rupees string to Paise (integer)
export function parseAmount(rupeesString) {
  const parsed = parseFloat(rupeesString.replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
}

// Convert Paise to Rupees (float)
export function paiseToRupees(paise) {
  return paise / 100;
}

// Convert Rupees to Paise (integer)
export function rupeesToPaise(rupees) {
  return Math.round(rupees * 100);
}
