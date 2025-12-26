import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type Component = IBaseComponent<any> | IBaseSVGComponent<any>
type StyleObj = Partial<CSSStyleDeclaration> & Record<string, any>

export function createStyler(base: Component): IStyler {
    return {
        style(s: StyleObj, delay?: number) {
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
    style(s: StyleObj, delay?: number): Component
    addClass(...classes: string[]): Component
    removeClass(...classes: string[]): Component
    toggleClass(cls: string, force?: boolean): Component
}

export default createStyler
