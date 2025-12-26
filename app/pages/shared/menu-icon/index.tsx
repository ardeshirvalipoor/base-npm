/** @jsx h */
import { Base, router, withRipple } from '@codesuma/baseline'
import { Bar } from './bar'
import styles from './index.module.css'

export const MenuIcon = () => {
    const base = (
        <Base
            class={styles.base}
            onClick={() => router.goto('/menu')}
            ref={(el: any) => withRipple(el)}
        >
            <Bar height={4} style={{ width: '50%' }} />
            <Bar height={4} />
            <Bar height={4} style={{ width: '80%' }} />
        </Base>
    )

    // Lifecycle: show/hide based on route
    router.on('change', ({ path }: any) => {
        const isHome = path.split('?')[0] === '/'
        base.toggleClass(styles.hidden, !isHome)
    })

    return base
}

export default MenuIcon
