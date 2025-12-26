import { Base } from '../base'

export const Input = (placeholder = '', type = 'text', options: { value?: string; accept?: string } = {}) => {
    const base = type === 'textarea' ? Base('textarea') : Base('input')

    base.el.setAttribute('type', type)
    base.el.setAttribute('placeholder', placeholder)
    if (options.accept) base.el.setAttribute('accept', options.accept)
    if (options.value) base.el.value = options.value

    // Events
    base.el.onblur = () => base.emit('blur')
    base.el.onfocus = () => base.emit('focus')
    base.el.oninput = () => base.emit('input', base.el.value)
    base.el.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') base.emit('enter', base.el.value)
        if (e.key === 'Escape') base.emit('escape')
        base.emit('keydown', { key: e.key, value: base.el.value })
    }

    return Object.assign(base, {
        focus() { base.el.focus() },
        blur() { base.el.blur() },
        select() { base.el.select() },
        value() { return base.el.value },
        setValue(v: string) { base.el.value = v },
        clear() { base.el.value = '' }
    })
}