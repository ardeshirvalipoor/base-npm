import { Base } from "@codesuma/baseline"
import styles from './bar.module.css'

export const Bar = (height: number) => {
    const base = Base('div')
    base.addClass(styles.bar)
    base.style({ height: `${height}px` })
    return base
}