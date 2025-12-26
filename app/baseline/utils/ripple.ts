// Ripple effect - Material Design style touch feedback

import { Base, IBaseComponent } from '../components/base'
import { injectCSS } from '../utils/styler'

const RIPPLE_CSS = `
[data-ripple] .ripple {
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.1;
    transform: scale(0);
    pointer-events: none;
}
[data-ripple] .ripple.animate {
    animation: ripple 1s ease-out;
}
@keyframes ripple {
    to { transform: scale(4); opacity: 0; }
}
`

export const withRipple = <T extends IBaseComponent<any>>(component: T): T => {
    injectCSS('base-ripple', RIPPLE_CSS)

    component.el.setAttribute('data-ripple', '')

    const createRipple = (x: number, y: number) => {
        const ripple = Base('span')
        ripple.el.className = 'ripple'

        const rect = component.el.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2

        ripple.style({
            width: size + 'px',
            height: size + 'px',
            left: (x - rect.left - size / 2) + 'px',
            top: (y - rect.top - size / 2) + 'px'
        })

        component.el.appendChild(ripple.el)
        ripple.el.classList.add('animate')

        setTimeout(() => ripple.el.remove(), 600)
    }

    component.el.addEventListener('touchstart', (e: TouchEvent) => {
        createRipple(e.touches[0].clientX, e.touches[0].clientY)
    }, { passive: true })

    component.el.addEventListener('mousedown', (e: MouseEvent) => {
        createRipple(e.clientX, e.clientY)
    })

    return component
}

export default withRipple
