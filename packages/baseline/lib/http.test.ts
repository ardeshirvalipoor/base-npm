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

describe('http headers', () => {
    it('sends Content-Type only with a body, so a cross-origin GET needs no preflight', async () => {
        const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)

        await http.get('/api/headers', { auth: 't' })
        await http.delete('/api/headers/1')
        await http.post('/api/headers', { a: 1 })

        const headersOf = (i: number) => fetchMock.mock.calls[i][1].headers as Record<string, string>
        expect(headersOf(0)).toEqual({ Authorization: 'Bearer t' })
        expect(headersOf(1)).toEqual({})
        expect(headersOf(2)).toEqual({ 'Content-Type': 'application/json' })
    })

    it('lets the caller set Content-Type', async () => {
        const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)

        await http.post('/api/headers', 'a=1', { headers: { 'Content-Type': 'text/plain' } })

        expect(fetchMock.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'text/plain' })
    })
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
