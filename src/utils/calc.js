export function calcRowTotal(qty, rate) {
  const q = parseFloat(qty) || 0
  const r = parseFloat(rate) || 0
  return q * r
}

export function calcSubtotal(items) {
  return items.reduce((sum, item) => sum + calcRowTotal(item.quantity, item.rate), 0)
}

export function calcTotals(items, financials) {
  const subtotal = calcSubtotal(items)
  const vatAmount = financials.vatEnabled ? (subtotal * (parseFloat(financials.vatPercent) || 0)) / 100 : 0
  const taxAmount = financials.taxEnabled ? (subtotal * (parseFloat(financials.taxPercent) || 0)) / 100 : 0
  const discountAmount = financials.discountEnabled ? (parseFloat(financials.discountAmount) || 0) : 0
  const grandTotal = subtotal + vatAmount + taxAmount - discountAmount
  return {
    subtotal,
    vatAmount,
    taxAmount,
    discountAmount,
    grandTotal: Math.max(grandTotal, 0),
  }
}

const CURRENCY_SYMBOLS = {
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function formatCurrency(amount, currency = 'BDT') {
  const symbol = CURRENCY_SYMBOLS[currency] || ''
  const num = (parseFloat(amount) || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${symbol} ${num}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
