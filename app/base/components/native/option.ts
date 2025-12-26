import { Base } from '../base'

export const Option = (value: string, text: string) => {
    const base = Base('option')
    base.el.value = value
    base.el.textContent = text
    return base
}