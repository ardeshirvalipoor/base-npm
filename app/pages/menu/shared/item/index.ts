import { Div, router, withRipple } from "../../../../../baseline/index"
import styles from "./index.module.css"

export const MenuItem = (title: string, target: string) => {
    const base = Div(title)

    base.el.onclick = () => setTimeout(() => router.goto(target), 100)
    withRipple(base)

    base.on('mounted', () => {
        console.log('mounted')
    })
    base.on('unmounted', () => {
        console.log('unmounted')
    })
    base.addClass(styles.base)
    return base
}