import { injectCSS } from '../utils/styler'

const RIPPLE_CSS = `
[data-ripple] {
    position: relative;
    overflow: hidden;
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

export const initRipple = () => {
    injectCSS('base-ripple', RIPPLE_CSS)

    let touchedRecently = false

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

    document.addEventListener('touchstart', (e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-ripple]')
        if (el) {
            touchedRecently = true
            createRipple(el, e.touches[0].clientX, e.touches[0].clientY)
            setTimeout(() => touchedRecently = false, 100)
        }
    }, { passive: true })

    document.addEventListener('mousedown', (e) => {
        if (touchedRecently) return
        const el = (e.target as HTMLElement).closest<HTMLElement>('[data-ripple]')
        if (el) {
            createRipple(el, e.clientX, e.clientY)
        }
    })
}