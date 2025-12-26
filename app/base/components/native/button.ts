import { Base } from '../base'

export const Button = (text = '') => {
    const base = Base('button')

    base.style({ cursor: 'pointer' })
    base.el.textContent = text
    base.el.onclick = () => base.emit('click')

    return Object.assign(base, {
        focus() { base.el.focus() },
        blur() { base.el.blur() },
        disable() { base.el.disabled = true },
        enable() { base.el.disabled = false },
        text(t: string) { base.el.textContent = t }
    })
}