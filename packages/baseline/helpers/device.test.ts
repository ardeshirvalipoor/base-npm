import { describe, it, expect, vi, afterEach } from 'vitest'
import { isIOS, isMobile } from './device'

const SAFARI = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('device', () => {
    it('knows an iPad, which reports the user agent of a Mac', () => {
        vi.stubGlobal('navigator', { userAgent: SAFARI, maxTouchPoints: 5 })

        expect(isIOS()).toBe(true)
        expect(isMobile()).toBe(true)
    })

    it('does not take a Mac for an iPad', () => {
        vi.stubGlobal('navigator', { userAgent: SAFARI, maxTouchPoints: 0 })

        expect(isIOS()).toBe(false)
        expect(isMobile()).toBe(false)
    })
})
