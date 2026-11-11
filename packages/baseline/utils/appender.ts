import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type AnyComponent = IBaseComponent<any> | IBaseSVGComponent<any>

// Lightweight observer - only checks if element entered document.body
let observer: MutationObserver | null = null

// Components waiting to enter the document, so a root attached with raw DOM
// calls still gets 'mounted'. Held weakly: a component that is built and never
// appended anywhere would otherwise sit here for the life of the page and be
// checked on every DOM mutation. WeakRef is reached through the global so the
// library still compiles against an ES2020 lib; where it is missing the hold
// is simply strong, which is what it always was.
interface Ref { deref(): AnyComponent | undefined }
const WeakRefCtor: (new (c: AnyComponent) => Ref) | undefined = (globalThis as any).WeakRef
const pendingRoots: Set<Ref> = new Set()
const refs = new WeakMap<AnyComponent, Ref>()

const watch = (c: AnyComponent) => {
    let ref = refs.get(c)
    if (!ref) refs.set(c, ref = WeakRefCtor ? new WeakRefCtor(c) : { deref: () => c })
    pendingRoots.add(ref)
    initObserver()
}

const unwatch = (c: AnyComponent) => {
    const ref = refs.get(c)
    if (ref) pendingRoots.delete(ref)
}

const initObserver = () => {
    if (observer) return
    observer = new MutationObserver(() => {
        pendingRoots.forEach(ref => {
            const component = ref.deref()
            // Collected, or in the document: either way no longer waited on.
            if (!component) pendingRoots.delete(ref)
            else if (document.body.contains(component.el)) {
                pendingRoots.delete(ref)
                markMounted(component)
            }
        })
        if (pendingRoots.size === 0 && observer) {
            observer.disconnect()
            observer = null
        }
    })
    observer.observe(document.body, { childList: true, subtree: true })
}

// Components made in this task that have no parent yet. Nearly all get one
// before the task ends, and so never need a weak reference or the observer.
// The rest are looked at once, when the task is over. `scheduled` keeps that
// to one look per task: the set empties and fills again with every row of a
// list that is being built.
const fresh: Set<AnyComponent> = new Set()
let scheduled = false

const checkFresh = () => {
    scheduled = false
    const made = Array.from(fresh)
    fresh.clear()
    for (const c of made) {
        if (c.isMounted) continue
        if (document.body.contains(c.el)) markMounted(c)
        else watch(c)
    }
}

const markMounted = (component: AnyComponent) => {
    if (component.isMounted) return
    component.isMounted = true
    component.emit('mounted')
    component.getChildren().forEach(markMounted)
}

// The subtree leaves the document but stays together, so a removed
// component can be appended again as it was.
const markUnmounted = (component: AnyComponent) => {
    component.getChildren().forEach(markUnmounted)
    component.isMounted = false
    component.emit('unmounted')
}

// A component is in one children list at a time. Before it moves, it
// leaves the list it is in, which can be the list it moves within.
const leaveParent = (c: AnyComponent) => {
    if (!c.parent) return
    c.parent._setChildren(c.parent.getChildren().filter(x => x !== c))
    c.parent = undefined
}

export function createAppender(base: AnyComponent): IAppender {
    let children: AnyComponent[] = []

    // Internal setter — used by child.remove() to update parent's children list
    const setChildren = (c: AnyComponent[]) => { children = c }

    // Register for root detection (will be cleaned up once mounted)
    if (!scheduled) {
        scheduled = true
        queueMicrotask(checkFresh)
    }
    fresh.add(base)

    // Called once c is in its new place in the DOM and in `children`
    const adopt = (c: AnyComponent) => {
        c.parent = base
        fresh.delete(c)
        unwatch(c) // No longer pending - has parent
        if (base.isMounted) markMounted(c)
    }

    const add = (c: AnyComponent) => {
        leaveParent(c)
        base.el.appendChild(c.el)
        children.push(c)
        adopt(c)
    }

    return {
        getChildren: () => children,

        _setChildren: setChildren,

        append(...args: (AnyComponent | false | null | undefined)[]) {
            for (const c of args) {
                if (!c) continue
                if (c instanceof Promise) c.then(resolved => { if (resolved?.el) add(resolved) })
                else if (c.el) add(c)
            }
            base.emit('append', args)
            return base
        },

        // prepend() and appendAfter() put each one right after the same
        // spot, so they go last one first to keep the order given.
        prepend(...args: AnyComponent[]) {
            for (const c of args.slice().reverse()) {
                if (!c?.el) continue
                leaveParent(c)
                base.el.insertBefore(c.el, base.el.firstChild)
                children.unshift(c)
                adopt(c)
            }
            base.emit('prepend', args)
            return base
        },

        appendBefore(ref: AnyComponent, ...args: AnyComponent[]) {
            for (const c of args) {
                if (!c?.el) continue
                leaveParent(c)
                base.el.insertBefore(c.el, ref.el)
                children.splice(children.indexOf(ref), 0, c)
                adopt(c)
            }
            return base
        },

        appendAfter(ref: AnyComponent, ...args: AnyComponent[]) {
            for (const c of args.slice().reverse()) {
                if (!c?.el) continue
                leaveParent(c)
                base.el.insertBefore(c.el, ref.el.nextSibling)
                children.splice(children.indexOf(ref) + 1, 0, c)
                adopt(c)
            }
            return base
        },

        // empty() and destroy() take the list out first. Each child leaves
        // its parent's list as it goes, and on the full list that is one
        // pass over the list per child.
        empty() {
            const removed = children
            children = []
            removed.forEach(c => c.remove())
        },

        remove() {
            // A root came in through raw DOM calls and can come back the
            // same way, so it is watched again.
            const root = !base.parent
            leaveParent(base)
            markUnmounted(base)
            if (root) watch(base)
            base.el.remove()
        },

        destroy() {
            const removed = children
            children = []
            removed.forEach(c => c.destroy())
            base.remove()
            // Gone for good, so nothing waits for it to come back
            unwatch(base)
            fresh.delete(base)
            base.removeAllListeners()
        }
    }
}

export interface IAppender {
    getChildren(): AnyComponent[]
    /** @internal */
    _setChildren(c: AnyComponent[]): void
    append(...args: (AnyComponent | Promise<AnyComponent> | false | null | undefined)[]): this
    prepend(...args: AnyComponent[]): this
    appendBefore(ref: AnyComponent, ...args: AnyComponent[]): this
    appendAfter(ref: AnyComponent, ...args: AnyComponent[]): this
    empty(): void
    remove(): void
    destroy(): void
}

export default createAppender