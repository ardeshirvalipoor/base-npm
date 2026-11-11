import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type Component = IBaseComponent<any> | IBaseSVGComponent<any>
export type CS = Partial<CSSStyleDeclaration> & Record<string, any>
// addClass() and removeClass() skip the empty and false ones, so a condition
// can sit in the call: addClass(styles.row, isDone && styles.done)
type ClassName = string | false | null | undefined

export function createStyler(base: Component): IStyler {
    function attr(key: string): string | null
    function attr(key: string, value: string | null): Component
    function attr(key: string, value?: string | null): string | null | Component
    function attr(key: string, value?: string | null) {
        if (value === undefined) return base.el.getAttribute(key)
        if (value === null) base.el.removeAttribute(key)
        else base.el.setAttribute(key, value)
        return base
    }

    return {
        style(s: CS, delay?: number) {
            const apply = () => {
                const keys = Object.keys(s)
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i]
                    const v = typeof s[k] === 'function' ? s[k]() : s[k]
                    // A custom property, such as --accent, is not a field of
                    // el.style. setProperty() would store undefined as the
                    // text "undefined", where a field ignores it.
                    if (!k.startsWith('--')) (base.el.style as any)[k] = v
                    else if (v !== undefined) base.el.style.setProperty(k, v)
                }
            }
            delay ? setTimeout(apply, delay) : apply()
            return base
        },

        attr,

        addClass(...classes: ClassName[]) {
            base.el.classList.add.apply(base.el.classList, classes.filter(Boolean) as string[])
            return base
        },

        removeClass(...classes: ClassName[]) {
            base.el.classList.remove.apply(base.el.classList, classes.filter(Boolean) as string[])
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

// The methods that chain return `this`, so a chain keeps the component's
// own type: Button('Save').addClass(styles.save) still has disable().
export interface IStyler {
    style(s: CS, delay?: number): this
    attr(key: string): string | null
    attr(key: string, value: string | null): this
    attr(key: string, value?: string | null): string | null | this
    addClass(...classes: ClassName[]): this
    removeClass(...classes: ClassName[]): this
    toggleClass(cls: string, force?: boolean): this
}


export default createStyler
