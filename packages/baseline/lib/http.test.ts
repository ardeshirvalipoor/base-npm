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

describe('http bodies', () => {
    it('does not throw on an empty body marked as JSON', async () => {
        vi.stubGlobal('fetch', vi.fn(async () =>
            new Response('', { status: 200, headers: { 'content-type': 'application/json' } })))

        const res = await http.delete('/api/users/1')

        expect(res).toEqual({ status: 200, data: '' })
    })

    it('sends a body that is false, 0 or an empty string', async () => {
        const fetchMock = vi.fn(async (_url: string, _init: RequestInit) => jsonResponse({}))
        vi.stubGlobal('fetch', fetchMock)

        await http.put('/api/flag', false)
        await http.put('/api/count', 0)
        await http.put('/api/name', '')
        await http.post('/api/nothing', null)

        expect(fetchMock.mock.calls.map(c => c[1].body)).toEqual(['false', '0', '""', undefined])
        expect(fetchMock.mock.calls[0][1].headers).toEqual({ 'Content-Type': 'application/json' })
        expect(fetchMock.mock.calls[3][1].headers).toEqual({})
    })
})

describe('http.upload', () => {
    it('sends the headers option, and leaves the file\'s type to the browser', async () => {
        const sent: Record<string, string> = {}
        class FakeXHR {
            upload = {}
            status = 201
            response = '{"ok":true}'
            onload = () => {}
            open() {}
            setRequestHeader(name: string, value: string) { sent[name] = value }
            send() { this.onload() }
        }
        vi.stubGlobal('XMLHttpRequest', FakeXHR)
        const file = new File(['x'], 'a.png', { type: 'image/png' })

        const res = await http.upload('/api/photos', file, { auth: 't', headers: { 'X-Album': 'trip' } })
        expect(res).toEqual({ status: 201, data: { ok: true } })
        // No Content-Type from here. The browser sends the file's own type
        // when the request names none, and a second one, even in another
        // case, would be joined to it: "image/png, application/octet-stream".
        expect(sent).toEqual({ 'X-Album': 'trip', Authorization: 'Bearer t' })

        await http.upload('/api/photos', file, { headers: { 'content-type': 'application/octet-stream' } })
        expect(sent).toEqual({ 'X-Album': 'trip', Authorization: 'Bearer t', 'content-type': 'application/octet-stream' })
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
