import { Base } from '../base'

export const A = (href = '#', text = '', target = '_self') => {
    const base = Base('a')
    base.el.href = href
    base.el.target = target
    if (text) base.el.textContent = text

    return Object.assign(base, {
        text(t: string) { base.el.textContent = t },
        href(h: string) { base.el.href = h },
        target(t: string) { base.el.target = t },
        download(filename: string) { base.el.download = filename }
    })
}