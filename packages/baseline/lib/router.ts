// Router - SPA navigation with page lifecycle (Hide/Show pattern)
// All pages stay in DOM, only visibility toggles for smooth transitions

import { createEmitter } from '../utils/emitter'
import { IBaseComponent } from '../components/base'

// Event payload for enter/exit events
export interface IRouteEvent {
    params: Record<string, string>
    query: Record<string, string>
    from: string
    data?: any
    isBack?: boolean  // True if navigating via back button
    to?: string
}

interface RouteConfig {
    page: () => IBaseComponent<any>
}

type Routes = Record<string, RouteConfig | (() => IBaseComponent<any>)>

// The path comes from the address bar, so a value can be badly encoded.
// Such a value stays as it came.
const decode = (value: string) => {
    try {
        return decodeURIComponent(value)
    } catch {
        return value
    }
}

// Extract params from path like /users/:id
const extractParams = (pattern: string, path: string): Record<string, string> | null => {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    if (patternParts.length !== pathParts.length) return null

    const params: Record<string, string> = {}
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = decode(pathParts[i])
        } else if (patternParts[i] !== pathParts[i]) {
            return null
        }
    }
    return params
}

export function createRouter() {
    const emitter = createEmitter()
    let currentPath = ''
    let currentPage: IBaseComponent<any> | null = null
    let viewContainer: IBaseComponent<any> | null = null
    const pageCache: Record<string, IBaseComponent<any>> = {}
    let routeConfigs: Routes = {}
    let initialized = false
    // The navigation in progress. It never rejects, so the ones waiting
    // behind it still run if it fails.
    let busy: Promise<void> | null = null

    // Find matching route
    const matchRoute = (path: string): { pattern: string; params: Record<string, string> } | null => {
        if (routeConfigs[path]) return { pattern: path, params: {} }
        for (const pattern of Object.keys(routeConfigs)) {
            if (pattern === '*') continue // Skip fallback during normal matching
            const params = extractParams(pattern, path)
            if (params) return { pattern, params }
        }
        // Fallback to wildcard route
        if (routeConfigs['*']) return { pattern: '*', params: {} }
        return null
    }

    // Get query params
    const getQuery = (key?: string) => {
        const params = new URLSearchParams(window.location.search)
        return key ? params.get(key) : Object.fromEntries(params)
    }

    // One navigation at a time. A goto() that comes while another one waits
    // for its exit animation starts after it, so it compares its path with
    // the page that one landed on. Before, a double tap pushed two history
    // entries for one page.
    const navigate = async (to: string, data?: any, isBack = false, initial = false) => {
        while (busy) await busy
        const run = go(to, data, isBack, initial)
        busy = run.then(() => { busy = null }, () => { busy = null })
        return run
    }

    // `isBack` marks a navigation from the browser's back or forward
    // button. `initial` marks the first one, to the page the browser
    // opened on (see init).
    const go = async (to: string, data: any, isBack: boolean, initial: boolean) => {
        const url = new URL(to, window.location.origin)
        const path = url.pathname
        const from = currentPath

        if (path === currentPath) return

        const match = matchRoute(path)
        if (!match) {
            console.warn(`No route found for: ${path}`)
            return
        }

        // Exit current page with direction — await async handlers
        if (currentPage) {
            await currentPage.emitAsync('exit', {
                params: {},
                query: getQuery(),
                from: currentPath,
                to: path,
                data,
                isBack
            })
        }

        // Update state
        currentPath = path
        if (!isBack && !initial) {
            try {
                history.pushState(data, '', to)
            } catch (err) {
                // The browser keeps a copy of `data` with the history entry,
                // and it cannot copy a function or an element. The old page
                // has left by now, so the entry goes in without the data. The
                // new page still gets `data` in its enter event. Anything
                // else that went wrong fails again here, and is thrown.
                console.warn(`Router: history.pushState failed for ${path}. Trying again without the data.`, err)
                history.pushState(null, '', to)
            }
        }

        // Get or create page
        let page = pageCache[path]
        if (!page) {
            const config = routeConfigs[match.pattern]
            const pageFactory = typeof config === 'function' ? config : config.page
            page = pageFactory()
            pageCache[path] = page
            if (viewContainer) {
                viewContainer.append(page)
            }
        }

        currentPage = page

        // Enter the new page with direction
        page.emit('enter', {
            params: match.params,
            query: getQuery(),
            from,
            to: path,
            data,
            isBack
        })

        emitter.emit('change', {
            path,
            params: match.params,
            query: getQuery(),
            from,
            to: path,
            data,
            isBack
        })
    }

    // Initialize router
    const init = () => {
        if (initialized) return
        initialized = true

        window.addEventListener('popstate', (e) => {
            navigate(window.location.pathname, e.state, true)
        })

        // The page the browser opened on already has its history entry, so no
        // new one is pushed. A copy would make the first back() land on the
        // same path, which popstate ignores, so it would take two to leave.
        if (currentPath === '' && viewContainer) {
            navigate(window.location.pathname + window.location.search, undefined, false, true)
        }
    }

    // Configure routes
    const routes = (config: Routes, view: IBaseComponent<any>) => {
        routeConfigs = config
        viewContainer = view
        init()
    }

    // Manually destroy a cached page
    const destroyPage = (path: string) => {
        const page = pageCache[path]
        if (page) {
            page.remove()
            delete pageCache[path]
        }
    }

    return {
        routes,
        init,
        goto: (path: string, data?: any) => navigate(path, data),
        back: () => history.back(),
        forward: () => history.forward(),
        getPath: () => currentPath,
        getQuery,
        getParams: () => matchRoute(currentPath)?.params || {},
        destroyPage,
        on: emitter.on.bind(emitter),
        off: emitter.off.bind(emitter),
        once: emitter.once.bind(emitter),
    }
}

// Default singleton for backward compatibility
export default createRouter()