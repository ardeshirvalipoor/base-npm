// Number formatting helpers

export const formatNumber = (n: number, decimals?: number) => {
    if (typeof n !== 'number') return String(n)
    const fixed = decimals !== undefined ? n.toFixed(decimals) : n.toString()
    const [whole, fraction] = fixed.split('.')
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (fraction ? '.' + fraction : '')
}

// Building an Intl formatter costs far more than using one, so each locale
// and currency keeps its own.
const currencies: Record<string, Intl.NumberFormat> = {}

export const formatCurrency = (n: number, currency = 'USD', locale = 'en-US') => {
    const key = locale + ' ' + currency
    return (currencies[key] || (currencies[key] = new Intl.NumberFormat(locale, { style: 'currency', currency }))).format(n)
}

export const formatPercent = (n: number, decimals = 0) =>
    (n * 100).toFixed(decimals) + '%'