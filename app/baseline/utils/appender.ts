import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type AnyComponent = IBaseComponent<any> | IBaseSVGComponent<any>

// Lightweight observer - only checks if element entered document.body
let observer: MutationObserver | null = null
const pendingRoots: Set<AnyComponent> = new Set()

const initObserver = () => {
    if (observer) return
    observer = new MutationObserver(() => {
        pendingRoots.forEach(component => {
            if (document.body.contains(component.el)) {
                pendingRoots.delete(component)
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

    // Register for root detection (will be cleaned up once mounted)
    pendingRoots.add(base)
    initObserver()

    return {
        children,

        getChildren: () => children,

        setChildren: (c: AnyComponent[]) => { children = c },

        append(...args: (AnyComponent | false | null | undefined)[]) {
            for (const c of args) {
                if (!c) continue
                if (c instanceof Promise) {
                    c.then(resolved => {
                        if (!resolved?.el) return
                        base.el.appendChild(resolved.el)
                        children.push(resolved)
                        resolved.parent = base
                        pendingRoots.delete(resolved) // No longer pending
                        if (base.isMounted) markMounted(resolved)
                    })
                    continue
                }
                if (!c.el) continue
                base.el.appendChild(c.el)
                children.push(c)
                c.parent = base
                pendingRoots.delete(c) // No longer pending - has parent
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
                pendingRoots.delete(c)
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
                pendingRoots.delete(c)
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
                pendingRoots.delete(c)
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
                base.parent.setChildren(base.parent.getChildren().filter(c => c !== base))
            }
            base.emit('unmounted')
            base.removeAllListeners()
            pendingRoots.delete(base)
            base.el.remove()
        }
    }
}

export interface IAppender {
    children: AnyComponent[]
    getChildren(): AnyComponent[]
    setChildren(c: AnyComponent[]): void
    append(...args: (AnyComponent | false | null | undefined)[]): AnyComponent
    prepend(...args: AnyComponent[]): AnyComponent
    appendBefore(ref: AnyComponent, ...args: AnyComponent[]): AnyComponent
    appendAfter(ref: AnyComponent, ...args: AnyComponent[]): AnyComponent
    empty(): void
    remove(): void
}

export default createAppender