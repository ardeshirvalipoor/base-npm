import { Base } from '../base'

const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export const Img = (src = '', options: { width?: number; height?: number; alt?: string } = {}) => {
    const base = Base('img')

    base.el.src = src || PLACEHOLDER
    if (options.alt) base.el.alt = options.alt
    if (options.width) base.style({ width: options.width + 'px' })
    if (options.height) base.style({ height: options.height + 'px' })

    return Object.assign(base, {
        src(s: string) { base.el.src = s },
        alt(a: string) { base.el.alt = a }
    })
}