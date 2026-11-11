// HTTP client with request deduplication and progress support

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions {
    headers?: Record<string, string>
    auth?: string
    onProgress?: (loaded: number, total: number) => void
}

// Request queue for deduplication
const pending: Record<string, Promise<any>> = {}

const request = async <T = any>(
    method: Method,
    url: string,
    body?: any,
    options: RequestOptions = {}
): Promise<{ status: number; data: T }> => {
    // Content-Type only with a body. On a request to another domain, the
    // header makes the browser send a preflight request first.
    // false, 0 and '' are bodies too. Only null and undefined mean no body.
    const hasBody = body != null
    const headers: Record<string, string> = hasBody ? { 'Content-Type': 'application/json' } : {}
    Object.assign(headers, options.headers)
    if (options.auth) headers['Authorization'] = `Bearer ${options.auth}`

    const res = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: hasBody ? JSON.stringify(body) : undefined
    })

    // An empty body is not JSON, whatever the header says. A server often
    // answers a DELETE that way.
    const text = await res.text()
    const isJson = res.headers.get('content-type')?.includes('application/json')
    const data: T = text && isJson ? JSON.parse(text) : text

    return { status: res.status, data }
}

// Deduplicated request - the same key shares one promise while it is in flight
const dedupe = <T>(key: string, fn: () => Promise<T>): Promise<T> => {
    if (!pending[key]) {
        pending[key] = fn().finally(() => delete pending[key])
    }
    return pending[key]
}

// Public API
export const http = {
    // Keyed by everything that can change the answer, not the address alone:
    // two GETs to one URL with different headers or tokens are two requests.
    get: <T = any>(url: string, options?: RequestOptions) =>
        dedupe(JSON.stringify([url, options?.auth, options?.headers]),
            () => request<T>('GET', url, undefined, options)),

    post: <T = any>(url: string, body?: any, options?: RequestOptions) =>
        request<T>('POST', url, body, options),

    put: <T = any>(url: string, body?: any, options?: RequestOptions) =>
        request<T>('PUT', url, body, options),

    patch: <T = any>(url: string, body?: any, options?: RequestOptions) =>
        request<T>('PATCH', url, body, options),

    delete: <T = any>(url: string, options?: RequestOptions) =>
        request<T>('DELETE', url, undefined, options),

    // Upload with progress (uses XHR for progress events)
    upload: (url: string, file: File, options: RequestOptions = {}) => {
        return new Promise<{ status: number; data: any }>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open('POST', url)
            // No Content-Type from here: the browser sends the file's own type
            // unless a header names another. Set here as well, the two would
            // go out joined, as "image/png, application/octet-stream".
            const headers: Record<string, string> = { ...options.headers }
            if (options.auth) headers['Authorization'] = `Bearer ${options.auth}`
            for (const name in headers) xhr.setRequestHeader(name, headers[name])

            if (options.onProgress) {
                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) options.onProgress!(e.loaded, e.total)
                }
            }

            xhr.onload = () => {
                try {
                    resolve({ status: xhr.status, data: JSON.parse(xhr.response) })
                } catch {
                    resolve({ status: xhr.status, data: xhr.response })
                }
            }
            xhr.onerror = () => reject(new Error('Upload failed'))
            xhr.send(file)
        })
    }
}

export default http
