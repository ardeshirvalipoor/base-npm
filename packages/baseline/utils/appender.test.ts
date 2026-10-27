import { describe, it, expect, vi, afterEach } from 'vitest'
import { Base } from '../components/base'

const tick = () => new Promise(r => setTimeout(r, 0))

afterEach(() => {
    document.body.innerHTML = ''
})

describe('appender', () => {
    it('append() attaches the child element, sets parent, and tracks it in getChildren()', () => {
        const parent = Base('div')
        const child = Base('span')

        parent.append(child)

        expect(parent.el.contains(child.el)).toBe(true)
        expect(child.parent).toBe(parent)
        expect(parent.getChildren()).toEqual([child])
    })

    it('append() ignores falsy args (conditional rendering pattern)', () => {
        const parent = Base('div')
        const child = Base('span')

        parent.append(child, false, null, undefined)

        expect(parent.getChildren()).toEqual([child])
    })

    it('append() marks a child mounted synchronously when the parent is already mounted', () => {
        const parent = Base('div')
        document.body.appendChild(parent.el)
        ;(parent as any).isMounted = true

        const child = Base('span')
        const mounted = vi.fn()
        child.on('mounted', mounted)

        parent.append(child)

        expect(child.isMounted).toBe(true)
        expect(mounted).toHaveBeenCalledTimes(1)
    })

    it('detects mounting via MutationObserver when attached directly to document.body', async () => {
        const root = Base('div')
        const child = Base('span')
        root.append(child)

        const rootMounted = vi.fn()
        const childMounted = vi.fn()
        root.on('mounted', rootMounted)
        child.on('mounted', childMounted)

        document.body.appendChild(root.el)
        await tick()

        expect(root.isMounted).toBe(true)
        expect(rootMounted).toHaveBeenCalledTimes(1)
        expect(child.isMounted).toBe(true)
        expect(childMounted).toHaveBeenCalledTimes(1)
    })

    it('prepend() inserts before existing children', () => {
        const parent = Base('div')
        const first = Base('span')
        const second = Base('span')

        parent.append(first)
        parent.prepend(second)

        expect(parent.getChildren()).toEqual([second, first])
        expect(parent.el.firstChild).toBe(second.el)
    })

    it('appendBefore() / appendAfter() insert at the right position', () => {
        const parent = Base('div')
        const a = Base('span')
        const b = Base('span')
        const c = Base('span')

        parent.append(a, c)
        parent.appendBefore(c, b)

        expect(parent.getChildren()).toEqual([a, b, c])

        const d = Base('span')
        parent.appendAfter(a, d)
        expect(parent.getChildren()).toEqual([a, d, b, c])
    })

    it('append() of a child that is already there moves it to the end without listing it twice', () => {
        const parent = Base('div')
        const a = Base('span')
        const b = Base('span')
        parent.append(a, b)

        parent.append(a)

        expect(parent.getChildren()).toEqual([b, a])
        expect(parent.el.lastChild).toBe(a.el)
    })

    it('moving a child to another parent takes it out of the old parent list', () => {
        const oldParent = Base('div')
        const newParent = Base('div')
        const child = Base('span')
        oldParent.append(child)

        newParent.append(child)
        oldParent.empty()

        expect(oldParent.getChildren()).toEqual([])
        expect(newParent.getChildren()).toEqual([child])
        expect(newParent.el.contains(child.el)).toBe(true)
    })

    it('prepend() and appendAfter() keep the order of their arguments', () => {
        const parent = Base('div')
        const ref = Base('span')
        const a = Base('span')
        const b = Base('span')
        const c = Base('span')
        const d = Base('span')
        parent.append(ref)

        parent.prepend(a, b)
        parent.appendAfter(ref, c, d)

        expect(parent.getChildren()).toEqual([a, b, ref, c, d])
        expect([...parent.el.children]).toEqual([a.el, b.el, ref.el, c.el, d.el])
    })

    it('prepend() goes before text that is not a component', () => {
        const parent = Base('button')
        const icon = Base('span')
        parent.text('Save')

        parent.prepend(icon)

        expect(parent.el.firstChild).toBe(icon.el)
    })

    it('remove() keeps the subtree, so the component can be appended again', () => {
        const parent = Base('div')
        document.body.appendChild(parent.el)
        ;(parent as any).isMounted = true
        const card = Base('div')
        const title = Base('span')
        card.append(title)
        parent.append(card)
        const titleUnmounted = vi.fn()
        const titleMounted = vi.fn()
        title.on('unmounted', titleUnmounted)
        title.on('mounted', titleMounted)

        card.remove()
        expect(titleUnmounted).toHaveBeenCalledTimes(1)
        expect(title.isMounted).toBe(false)

        parent.append(card)
        expect(card.el.contains(title.el)).toBe(true)
        expect(card.getChildren()).toEqual([title])
        expect(titleMounted).toHaveBeenCalledTimes(1)
    })

    it('append() attaches a resolved Promise child once it settles', async () => {
        const parent = Base('div')
        const child = Base('span')

        parent.append(Promise.resolve(child))
        expect(parent.getChildren()).toEqual([])

        await tick()

        expect(parent.el.contains(child.el)).toBe(true)
        expect(parent.getChildren()).toEqual([child])
    })

    it('remove() detaches from the DOM and from the parent children list, emitting unmounted', () => {
        const parent = Base('div')
        const child = Base('span')
        parent.append(child)

        const unmounted = vi.fn()
        child.on('unmounted', unmounted)

        child.remove()

        expect(parent.el.contains(child.el)).toBe(false)
        expect(parent.getChildren()).toEqual([])
        expect(child.isMounted).toBe(false)
        expect(unmounted).toHaveBeenCalledTimes(1)
    })

    it('empty() removes all children but keeps the parent itself', () => {
        const parent = Base('div')
        parent.append(Base('span'), Base('span'))

        parent.empty()

        expect(parent.getChildren()).toEqual([])
        expect(parent.el.childNodes.length).toBe(0)
    })

    it('destroy() recursively destroys children and clears all listeners', () => {
        const parent = Base('div')
        const child = Base('span')
        parent.append(child)

        const parentHandler = vi.fn()
        parent.on('anything', parentHandler)

        parent.destroy()

        expect(parent.getChildren()).toEqual([])
        expect(parent.getListeners()).toEqual({})
        parent.emit('anything')
        expect(parentHandler).not.toHaveBeenCalled()
    })
})
