import { Base, router } from "../../baseline/index"
import { Bar } from './bar'
import styles from './index.module.css'

export const MenuIcon = () => {
    const base = Base()
    const top = Bar(4)
    const middle = Bar(4)
    const bottom = Bar(4)

    base.addClass(styles.base)
    base.append(top, middle, bottom)

    top.style({ width: '50%' })
    bottom.style({ width: '80%' })

    base.el.onclick = () => router.goto('/menu')

    router.on('change', ({ path }: any) => {
        path.split('?')[0] === '/' ? show() : hide()
    })

    function show() {
        base.removeClass(styles.hidden)
    }

    function hide() {
        base.addClass(styles.hidden)
    }

    return base
}

export default MenuIcon