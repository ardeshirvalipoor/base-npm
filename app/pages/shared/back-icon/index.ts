import { Base, router, waitFor, withRipple } from "../../baseline/index"
import styles from './index.module.css'

export const BackIcon = () => {
    const base = Base()
    const top = Base('div')
    const bottom = Base('div')

    top.addClass(styles.bar, styles.barTop)
    bottom.addClass(styles.bar, styles.barBottom)

    base.addClass(styles.base)
    base.append(top, bottom)

    base.el.onclick = () => router.back()

    router.on('change', ({ path }: any) => {
        path === '/' ? hide() : show()
    })

    async function show() {
        await waitFor(200)
        base.addClass(styles.visible)
        base.removeClass(styles.hidden)
    }

    function hide() {
        base.removeClass(styles.visible)
        base.addClass(styles.hidden)
    }

    return base
}

export default BackIcon
