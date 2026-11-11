import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatDate, formatTime } from './date'

afterEach(() => {
    vi.unstubAllEnvs()
})

describe('formatDate and formatTime', () => {
    it('keep each locale apart when they reuse a formatter', () => {
        const date = new Date(2026, 10, 10, 9, 5)
        const twice = () => [formatDate(date), formatDate(date, 'de-DE'), formatTime(date, 'en-GB'), formatTime(date, 'de-DE')]

        expect(twice()).toEqual(['November 10, 2026', '10. November 2026', '09:05', '09:05'])
        expect(twice()).toEqual(['November 10, 2026', '10. November 2026', '09:05', '09:05'])
    })

    it('follow the device when its time zone changes', () => {
        // A formatter stays in the zone it was built in, so one that is kept
        // would go on showing Tehran time in New York.
        const noon = new Date(Date.UTC(2026, 10, 10, 12, 0))

        vi.stubEnv('TZ', 'Asia/Tehran')
        expect([formatTime(noon, 'en-GB'), formatDate(noon, 'en-GB')]).toEqual(['15:30', '10 November 2026'])

        vi.stubEnv('TZ', 'Pacific/Kiritimati')
        expect([formatTime(noon, 'en-GB'), formatDate(noon, 'en-GB')]).toEqual(['02:00', '11 November 2026'])
    })
})
