import { Div, router } from "@codesuma/baseline"
import styles from "./index.module.css"

export const MenuItem = (title: string, target: string) => {
    const base = Div(title)

    base.on('click', () => setTimeout(() => router.goto(target), 100))
    base.addClass(styles.base)
    return base
}