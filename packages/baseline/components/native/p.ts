import { Base } from '../base'

export const P = (content = '') => {
    const base = Base('p')
    if (content) base.el.textContent = content

    return base
}