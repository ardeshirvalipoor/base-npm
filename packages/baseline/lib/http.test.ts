import { describe, it, expect, vi, afterEach } from 'vitest'
import http from './http'

const jsonResponse = (body: unknown) => ({
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    json: async () => body,
    text: async () => JSON.stringify(body),
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('http.get deduplication', () => {
    it('shares one request between identical concurrent GETs', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({ ok: 1 }))
        vi.stubGlobal('fetch', fetchMock)

        await Promise.all([http.get('/api/x'), http.get('/api/x')])

        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('keeps GETs with different auth or headers apart', async () => {
        const fetchMock = vi.fn(async () => jsonResponse({ ok: 1 }))
        vi.stubGlobal('fetch', fetchMock)

        await Promise.all([
            http.get('/api/x', { auth: 'a' }),
            http.get('/api/x', { auth: 'b' }),
            http.get('/api/x', { headers: { 'X-Tenant': 't1' } }),
        ])

        expect(fetchMock).toHaveBeenCalledTimes(3)
    })
})
