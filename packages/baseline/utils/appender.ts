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
    const ref: Ref = WeakRefCtor ? new WeakRefCtor(c) : { deref: () => c }
    refs.set(c, ref)
    pendingRoots.add(ref)
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

const markMounted = (component: AnyComponent) => {
    if (component.isMounted) return
    component.isMounted = true
    component.emit('mounted')
    component.getChildren().forEach(markMounted)
}

export function createAppender(base: AnyComponent): IAppender {
    let children: AnyComponent[] = []

    // Internal setter — used by child.remove() to update parent's children list
    const setChildren = (c: AnyComponent[]) => { children = c }

    // Register for root detection (will be cleaned up once mounted)
    watch(base)
    initObserver()

    return {
        getChildren: () => children,

        _setChildren: setChildren,

        append(...args: (AnyComponent | false | null | undefined)[]) {
            for (const c of args) {
                if (!c) continue
                if (c instanceof Promise) {
                    c.then(resolved => {
                        if (!resolved?.el) return
                        base.el.appendChild(resolved.el)
                        children.push(resolved)
                        resolved.parent = base
                        unwatch(resolved) // No longer pending
                        if (base.isMounted) markMounted(resolved)
                    })
                    continue
                }
                if (!c.el) continue
                base.el.appendChild(c.el)
                children.push(c)
                c.parent = base
                unwatch(c) // No longer pending - has parent
                if (base.isMounted) markMounted(c)
            }
            base.emit('append', args)
            return base
        },

        prepend(...args: AnyComponent[]) {
            for (const c of args) {
                if (!c?.el) continue
                base.el.insertBefore(c.el, base.el.firstChild)
                children.unshift(c)
                c.parent = base
                unwatch(c)
                if (base.isMounted) markMounted(c)
            }
            base.emit('prepend', args)
            return base
        },

        appendBefore(ref: AnyComponent, ...args: AnyComponent[]) {
            for (const c of args) {
                if (!c?.el) continue
                base.el.insertBefore(c.el, ref.el)
                const idx = children.indexOf(ref)
                children.splice(idx, 0, c)
                c.parent = base
                unwatch(c)
                if (base.isMounted) markMounted(c)
            }
            return base
        },

        appendAfter(ref: AnyComponent, ...args: AnyComponent[]) {
            for (const c of args) {
                if (!c?.el) continue
                base.el.insertBefore(c.el, ref.el.nextSibling)
                const idx = children.indexOf(ref)
                children.splice(idx + 1, 0, c)
                c.parent = base
                unwatch(c)
                if (base.isMounted) markMounted(c)
            }
            return base
        },

        empty() {
            children.forEach(c => c.remove())
            children = []
        },

        remove() {
            children.forEach(c => c.remove())
            if (base.parent) {
                const parentChildren = base.parent.getChildren().filter(c => c !== base)
                base.parent._setChildren(parentChildren)
            }
            base.isMounted = false
            base.emit('unmounted')
            unwatch(base)
            base.el.remove()
        },

        destroy() {
            children.forEach(c => c.destroy())
            base.remove()
            base.removeAllListeners()
        }
    }
}

export interface IAppender {
    getChildren(): AnyComponent[]
    /** @internal */
    _setChildren(c: AnyComponent[]): void
    append(...args: (AnyComponent | Promise<AnyComponent> | false | null | undefined)[]): AnyComponent
    prepend(...args: AnyComponent[]): AnyComponent
    appendBefore(ref: AnyComponent, ...args: AnyComponent[]): AnyComponent
    appendAfter(ref: AnyComponent, ...args: AnyComponent[]): AnyComponent
    empty(): void
    remove(): void
    destroy(): void
}

export default createAppender