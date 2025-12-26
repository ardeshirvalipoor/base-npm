import { BaseSVG } from '../base'

export const SVG = (viewBox: string | number, height?: number) => {
    const base = BaseSVG('svg')

    if (typeof viewBox === 'string') {
        base.el.setAttribute('viewBox', viewBox)
    } else {
        const h = height || viewBox
        base.el.setAttribute('viewBox', `0 0 ${viewBox} ${h}`)
        base.el.setAttribute('width', String(viewBox))
        base.el.setAttribute('height', String(h))
    }

    return Object.assign(base, {
        html(content: string) { base.el.innerHTML = content }
    })
}