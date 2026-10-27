import { describe, it, expect } from 'vitest'
import { formatNumber } from './format'

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
