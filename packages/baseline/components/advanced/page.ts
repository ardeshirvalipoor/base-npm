// Page component with directional enter/exit transitions

import { Div } from '../native/div'
import { IRouteEvent } from '../../lib/router'
import { waitFor } from '../../utils/wait'
import styles from './page.module.css'

const TRANSITION_DURATION = 160

export const Page = () => {
    const base = Div()
    base.addClass(styles.page)  // Initial state is hidden below (in CSS)
    base.el.setAttribute('aria-hidden', 'true')

    // Enter: direction based on isBack flag
    base.on('enter', async ({ isBack }: IRouteEvent) => {
        // Pre-position correctly before entering to ensure correct transition direction
        if (isBack) {
            base.addClass(styles.hiddenAbove)
            base.removeClass(styles.hiddenBelow)
        } else {
            base.addClass(styles.hiddenBelow)
            base.removeClass(styles.hiddenAbove)
        }

        // Force reflow so browser registers the starting position
        // This is critical for the first transition to be smooth
        void base.el.offsetHeight

        // Visual delay before entering
        await waitFor(200)

        // Clear all state classes
        base.removeClass(
            styles.exitUp,
            styles.exitDown,
            styles.hiddenBelow,
            styles.hiddenAbove
        )
        // Add enter class (same visual result, but positioned correctly before)
        base.addClass(isBack ? styles.enterDown : styles.enterUp)
        base.el.setAttribute('aria-hidden', 'false')
    })

    // Exit: direction based on isBack flag
    base.on('exit', async ({ isBack }: IRouteEvent) => {
        base.removeClass(styles.enterUp, styles.enterDown)
        if (isBack) {
            // Back: current page goes DOWN
            base.addClass(styles.exitDown)
        } else {
            // Forward: current page goes UP
            base.addClass(styles.exitUp)
        }
        await waitFor(TRANSITION_DURATION)

        base.el.setAttribute('aria-hidden', 'true')

        // Position for next enter
        if (isBack) {
            // After exiting down, position below for next forward enter
            base.addClass(styles.hiddenBelow)
        } else {
            // After exiting up, position above for next back enter
            base.addClass(styles.hiddenAbove)
        }
    })

    return Object.assign(base, {
        // Show the page immediately, skipping the enter animation entirely
        showInstant() {
            base.style({ transition: 'none' })
            base.removeClass(styles.exitUp, styles.exitDown, styles.hiddenBelow, styles.hiddenAbove, styles.enterUp, styles.enterDown)
            void base.el.offsetHeight
            base.addClass(styles.enterUp)
            base.el.setAttribute('aria-hidden', 'false')
            void base.el.offsetHeight
            base.style({ transition: '' })
        },

        // Force the downward exit variant regardless of navigation direction
        async exitDown() {
            base.removeClass(styles.enterUp, styles.enterDown)
            base.addClass(styles.exitDown)
            await waitFor(TRANSITION_DURATION)
            base.el.setAttribute('aria-hidden', 'true')
            base.addClass(styles.hiddenBelow)
        }
    })
}

export default Page
