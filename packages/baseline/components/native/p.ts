import { Base } from '../base'

export const P = (content = '') => {
    const base = Base('p')
    if (content) base.el.textContent = content

    return Object.assign(base, {
        text(t: string) { base.el.textContent = t },
        html(h: string) { base.el.innerHTML = h }
    })
}