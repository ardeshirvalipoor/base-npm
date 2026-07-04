import { Base } from '../base'

export const Div = (content = '') => {
    const base = Base('div')
    if (content) base.el.innerHTML = content

    return base
}