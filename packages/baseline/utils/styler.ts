import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type Component = IBaseComponent<any> | IBaseSVGComponent<any>
export type CS = Partial<CSSStyleDeclaration> & Record<string, any>

export function createStyler(base: Component): IStyler {
    return {
        style(s: CS, delay?: number) {
            const apply = () => {
                const keys = Object.keys(s)
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i]
                    const v = s[k]
                        ; (base.el.style as any)[k] = typeof v === 'function' ? v() : v
                }
            }
            delay ? setTimeout(apply, delay) : apply()
            return base
        },

        attr(key: string, value?: string) {
            if (value === undefined) return base.el.getAttribute(key)
            base.el.setAttribute(key, value)
            return base
        },

        text(content: string) {
            base.el.textContent = content
            return base
        },

        html(content: string) {
            base.el.innerHTML = content
            return base
        },

        addClass(...classes: string[]) {
            base.el.classList.add.apply(base.el.classList, classes)
            return base
        },

        removeClass(...classes: string[]) {
            base.el.classList.remove.apply(base.el.classList, classes)
            return base
        },

        toggleClass(cls: string, force?: boolean) {
            base.el.classList.toggle(cls, force)
            return base
        }
    }
}

// Inject CSS once - for components that need self-contained styles
const injected: Record<string, boolean> = {}
export function injectCSS(id: string, css: string) {
    if (injected[id]) return
    injected[id] = true
    const el = document.createElement('style')
    el.id = id
    el.textContent = css
    document.head.appendChild(el)
}

export interface IStyler {
    style(s: CS, delay?: number): Component
    attr(key: string, value?: string): string | null | Component
    text(content: string): Component
    html(content: string): Component
    addClass(...classes: string[]): Component
    removeClass(...classes: string[]): Component
    toggleClass(cls: string, force?: boolean): Component
}


export default createStyler
