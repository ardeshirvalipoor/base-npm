import { Div, Button } from '@codesuma/baseline'
import styles from './index.module.css'

export const Counter = () => {
    // Base
    const base = Div()
    base.addClass(styles.base)

    // State
    const count = { value: 0 }

    // Counter Display
    const display = Div('0')
    display.addClass(styles.display)
    base.append(display)

    // Action Button
    const btn = Button('Count')
    btn.addClass(styles.btn)
    btn.on('click', () => {
        count.value++
        display.text(String(count.value))
    })
    base.append(btn)

    return base
}
