import { Base } from '../base'

export const Canvas = (width: number, height: number) => {
    const base = Base('canvas')
    base.el.width = width
    base.el.height = height

    return Object.assign(base, {
        ctx: base.el.getContext('2d')!,
        resize(w: number, h: number) {
            base.el.width = w
            base.el.height = h
        }
    })
}