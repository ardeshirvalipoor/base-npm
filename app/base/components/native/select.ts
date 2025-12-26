import { Base } from '../base'
import { Option } from './option'

export const Select = (options: { value: string; text: string }[] = []) => {
    const base = Base('select')

    options.forEach(({ value, text }) => base.append(Option(value, text)))
    base.el.onchange = () => base.emit('change', base.el.value)

    return Object.assign(base, {
        add(value: string, text: string) { base.append(Option(value, text)) },
        value() { return base.el.value },
        setValue(v: string) { base.el.value = v }
    })
}