import { Div, router } from "@codesuma/baseline"
import styles from "./index.module.css"

export const MenuItem = (title: string, target: string) => {
    const base = Div(title)

    base.el.onclick = () => setTimeout(() => router.goto(target), 100)

    base.on('mounted', () => {
        console.log('mounted')
    })
    base.on('unmounted', () => {
        console.log('unmounted')
    })
    base.addClass(styles.base)
    return base
}