import { Base } from '../base'

export const Div = (content = '') => {
    const base = Base('div')
    if (content) base.el.innerHTML = content

    return Object.assign(base, {
        text(t: string) { base.el.textContent = t },
        html(h: string) { base.el.innerHTML = h }
    })
}