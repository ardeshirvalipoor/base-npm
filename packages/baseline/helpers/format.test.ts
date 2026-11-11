import { describe, it, expect } from 'vitest'
import { formatNumber, formatCurrency } from './format'

describe('formatCurrency', () => {
    it('keeps each currency and locale apart when it reuses a formatter', () => {
        const twice = () => [formatCurrency(1234.5), formatCurrency(1234.5, 'EUR'), formatCurrency(1234.5, 'EUR', 'de-DE')]

        expect(twice()).toEqual(['$1,234.50', '€1,234.50', '1.234,50 €'])
        expect(twice()).toEqual(['$1,234.50', '€1,234.50', '1.234,50 €'])
    })
})

describe('formatNumber', () => {
    it('groups the whole part in thousands', () => {
        expect(formatNumber(1234567)).toBe('1,234,567')
        expect(formatNumber(-1234.5)).toBe('-1,234.5')
    })

    it('leaves the decimals alone', () => {
        expect(formatNumber(1234.5678, 4)).toBe('1,234.5678')
        expect(formatNumber(1000, 2)).toBe('1,000.00')
    })
})
