import { Base } from '../base'

export const Span = (content = '') => {
    const base = Base('span')
    if (content) base.el.textContent = content

    return Object.assign(base, {
        text(t: string) { base.el.textContent = t },
        html(h: string) { base.el.innerHTML = h }
    })
}