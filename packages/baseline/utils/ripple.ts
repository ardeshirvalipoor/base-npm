import { injectCSS } from '../utils/styler'

const RIPPLE_CSS = `
[data-ripple] {
    overflow: hidden;
}
:where([data-ripple]) {
    position: relative;
}
[data-ripple] .ripple {
    position: absolute;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.15;
    transform: scale(0);
    pointer-events: none;
    animation: ripple 600ms ease-out forwards;
}
@keyframes ripple {
    to { transform: scale(4); opacity: 0; }
}
`

let initialized = false

export const initRipple = () => {
    if (initialized) return
    initialized = true
    injectCSS('base-ripple', RIPPLE_CSS)

    const createRipple = (el: HTMLElement, x: number, y: number) => {
        const rect = el.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2

        const ripple = document.createElement('span')
        ripple.className = 'ripple'
        Object.assign(ripple.style, {
            width: size + 'px',
            height: size + 'px',
            left: (x - rect.left - size / 2) + 'px',
            top: (y - rect.top - size / 2) + 'px'
        })

        el.appendChild(ripple)
        ripple.addEventListener('animationend', () => ripple.remove())
    }

    // One pointerdown comes for a press, from a mouse, a finger or a pen. A
    // touch also sends a mousedown once the finger lifts, so listening to
    // touchstart and mousedown showed two ripples for a slow tap. A disabled
    // button gets pointerdown too, and must not answer a press.
    document.addEventListener('pointerdown', (e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-ripple]:not(:disabled)')
        if (el) createRipple(el, e.clientX, e.clientY)
    }, { passive: true })
}
