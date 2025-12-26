// Number formatting helpers

export const formatNumber = (n: number, decimals?: number) => {
    if (typeof n !== 'number') return String(n)
    const fixed = decimals !== undefined ? n.toFixed(decimals) : n.toString()
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatCurrency = (n: number, currency = 'USD', locale = 'en-US') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n)

export const formatPercent = (n: number, decimals = 0) =>
    (n * 100).toFixed(decimals) + '%'