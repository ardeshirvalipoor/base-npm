import { Base } from '../base'

export const Span = (content = '') => {
    const base = Base('span')
    if (content) base.el.textContent = content

    return base
}