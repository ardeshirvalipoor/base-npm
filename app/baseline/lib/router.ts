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

const emitter = createEmitter()
let currentPath = ''
let currentPage: IBaseComponent<any> | null = null
let viewContainer: IBaseComponent<any> | null = null
const pageCache: Record<string, IBaseComponent<any>> = {}
let routeConfigs: Routes = {}
let initialized = false
let isBackNavigation = false

// Extract params from path like /users/:id
const extractParams = (pattern: string, path: string): Record<string, string> | null => {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    if (patternParts.length !== pathParts.length) return null

    const params: Record<string, string> = {}
    for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
            params[patternParts[i].slice(1)] = pathParts[i]
        } else if (patternParts[i] !== pathParts[i]) {
            return null
        }
    }
    return params
}

// Find matching route
const matchRoute = (path: string): { pattern: string; params: Record<string, string> } | null => {
    if (routeConfigs[path]) return { pattern: path, params: {} }
    for (const pattern of Object.keys(routeConfigs)) {
        const params = extractParams(pattern, path)
        if (params) return { pattern, params }
    }
    return null
}

// Get query params
const getQuery = (key?: string) => {
    const params = new URLSearchParams(window.location.search)
    return key ? params.get(key) : Object.fromEntries(params)
}

// Handle navigation
const navigate = async (to: string, data?: any) => {
    const url = new URL(to, window.location.origin)
    const path = url.pathname
    const from = currentPath
    const isBack = isBackNavigation

    if (path === currentPath) return

    const match = matchRoute(path)
    if (!match) {
        console.warn(`No route found for: ${path}`)
        return
    }

    // Exit current page with direction
    if (currentPage) {
        currentPage.emit('exit', {
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
    if (!isBack) {
        history.pushState(data, '', to)
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

    // Reset back flag
    isBackNavigation = false
}

// Initialize router
const init = () => {
    if (initialized) return
    initialized = true

    window.addEventListener('popstate', (e) => {
        isBackNavigation = true  // Mark as back navigation
        const path = window.location.pathname
        if (path !== currentPath) {
            navigate(path, e.state)
        }
    })

    if (currentPath === '' && viewContainer) {
        navigate(window.location.pathname + window.location.search)
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

export default {
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