import { Div } from "@codesuma/baseline"
import styles from './index.module.css'

export const Card = () => {
    const base = Div()

    // Static styles from CSS class
    base.addClass(styles.base)
    base.text('Card')

    // Example: hover effect with JS (if needed dynamically)
    base.el.onmouseenter = () => base.style({ transform: 'translateY(-4px)' })
    base.el.onmouseleave = () => base.style({ transform: 'translateY(0)' })

    return base
}