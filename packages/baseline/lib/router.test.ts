import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRouter } from './router'
import { Base } from '../components/base'
import type { IBaseComponent } from '../components/base'
import type { IRouteEvent } from './router'

// Each test gets its own router + view container so state never leaks across tests.
const setup = () => {
    const router = createRouter()
    const view = Base('div')
    return { router, view }
}

const Page = (): IBaseComponent<'div'> => Base('div')

// routes() auto-navigates to the current browser location on first call, so we
// park it somewhere no test's routes match, keeping each test's explicit
// goto() calls as the only source of navigation.
beforeEach(() => {
    history.replaceState(null, '', '/__init__')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe('router', () => {
    it('navigates to a static route and fires enter on the page', async () => {
        const { router, view } = setup()
        const home = Page()
        const enter = vi.fn()
        home.on('enter', enter)

        router.routes({ '/': () => home }, view)
        await router.goto('/')

        expect(enter).toHaveBeenCalledTimes(1)
        expect(router.getPath()).toBe('/')
        expect(view.getChildren()).toContain(home)
    })

    it('extracts dynamic params from the matched pattern', async () => {
        const { router, view } = setup()
        const userPage = Page()
        let received: IRouteEvent | undefined
        userPage.on('enter', (e: IRouteEvent) => { received = e })

        router.routes({ '/users/:id': () => userPage }, view)
        await router.goto('/users/42')

        expect(received?.params).toEqual({ id: '42' })
        expect(router.getParams()).toEqual({ id: '42' })
    })

    it('parses query params from the destination URL', async () => {
        const { router, view } = setup()
        const search = Page()
        let received: IRouteEvent | undefined
        search.on('enter', (e: IRouteEvent) => { received = e })

        router.routes({ '/search': () => search }, view)
        await router.goto('/search?q=hello&page=2')

        expect(received?.query).toEqual({ q: 'hello', page: '2' })
        expect(router.getQuery('q')).toBe('hello')
    })

    it('falls back to the wildcard route when nothing matches', async () => {
        const { router, view } = setup()
        const notFound = Page()
        const enter = vi.fn()
        notFound.on('enter', enter)

        // '*' also matches the auto-init navigation to '/__init__' - that's
        // real, correct fallback behavior, just not what this test targets.
        router.routes({ '/': Page, '*': () => notFound }, view)
        enter.mockClear()
        await router.goto('/does/not/exist')

        expect(enter).toHaveBeenCalledTimes(1)
    })

    it('warns and does not navigate when no route matches and there is no wildcard', async () => {
        const { router, view } = setup()

        router.routes({ '/': Page }, view)
        await router.goto('/nowhere')

        expect(console.warn).toHaveBeenCalled()
        expect(router.getPath()).toBe('')
    })

    it('caches pages and reuses the same instance on revisit', async () => {
        const { router, view } = setup()
        let calls = 0
        const factory = () => { calls++; return Page() }

        router.routes({ '/': Page, '/about': factory }, view)
        await router.goto('/about')
        await router.goto('/')
        await router.goto('/about')

        expect(calls).toBe(1)
    })

    it('destroyPage evicts the cache so the next visit creates a fresh page', async () => {
        const { router, view } = setup()
        let calls = 0
        const factory = () => { calls++; return Page() }

        router.routes({ '/': Page, '/about': factory }, view)
        await router.goto('/about')
        router.destroyPage('/about')
        await router.goto('/')
        await router.goto('/about')

        expect(calls).toBe(2)
    })

    it('awaits the exit handler of the current page before entering the next', async () => {
        const { router, view } = setup()
        const order: string[] = []
        const a = Page()
        const b = Page()
        a.on('exit', async () => {
            order.push('a-exit-start')
            await new Promise(r => setTimeout(r, 5))
            order.push('a-exit-end')
        })
        b.on('enter', () => order.push('b-enter'))

        router.routes({ '/a': () => a, '/b': () => b }, view)
        await router.goto('/a')
        await router.goto('/b')

        expect(order).toEqual(['a-exit-start', 'a-exit-end', 'b-enter'])
    })

    it('marks back navigation via popstate with isBack: true', async () => {
        const { router, view } = setup()
        const a = Page()
        const b = Page()
        const events: IRouteEvent[] = []
        a.on('enter', (e: IRouteEvent) => events.push(e))

        router.routes({ '/a': () => a, '/b': () => b }, view)
        await router.goto('/a')
        await router.goto('/b')
        router.back()

        // jsdom fires popstate asynchronously after history.back()
        await new Promise(r => setTimeout(r, 20))

        const backEvent = events.find(e => e.isBack)
        expect(backEvent).toBeTruthy()
        expect(router.getPath()).toBe('/a')
    })

    it('does not carry the back flag from a popstate that lands on the current path', async () => {
        const { router, view } = setup()
        const a = Page()
        const b = Page()
        const events: IRouteEvent[] = []
        b.on('enter', (e: IRouteEvent) => events.push(e))

        router.routes({ '/a': () => a, '/b': () => b }, view)
        await router.goto('/a')
        // An entry the app pushed itself for a query change on the same path,
        // the way a two-panel layout does when a second item opens beside a list.
        history.pushState(null, '', '/a?item=2')
        router.back()
        await new Promise(r => setTimeout(r, 20))
        expect(router.getPath()).toBe('/a')

        // The next forward navigation must still be a forward one: entered
        // with isBack false, and with its own history entry.
        await router.goto('/b')

        expect(events[0]?.isBack).toBe(false)
        expect(window.location.pathname).toBe('/b')
    })

    it('leaves the page it opened on in one back()', async () => {
        // An app reloaded on /menu, with /home behind it in the history.
        history.replaceState(null, '', '/home')
        history.pushState(null, '', '/menu')
        const before = history.length
        const { router, view } = setup()

        router.routes({ '/home': Page, '/menu': Page }, view)
        expect(router.getPath()).toBe('/menu')
        expect(history.length).toBe(before)

        router.back()
        await new Promise(r => setTimeout(r, 20))

        expect(router.getPath()).toBe('/home')
    })
})
