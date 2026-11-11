import { describe, it, expect, vi, afterEach } from 'vitest'
import { initRipple } from './ripple'

const rippleButton = () => {
    const btn = document.createElement('button')
    btn.setAttribute('data-ripple', '')
    document.body.appendChild(btn)
    return btn
}

afterEach(() => {
    vi.useRealTimers()
})

describe('initRipple', () => {
    it('shows one ripple per press when called more than once', () => {
        initRipple()
        initRipple()
        const btn = rippleButton()

        btn.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))

        expect(btn.querySelectorAll('.ripple').length).toBe(1)
    })

    it('leaves a disabled button alone', () => {
        initRipple()
        const btn = rippleButton()
        btn.disabled = true

        // A browser sends pointerdown to a disabled button, though no mousedown.
        btn.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))

        expect(btn.querySelectorAll('.ripple').length).toBe(0)
    })

    it('shows one ripple for a touch, however long the finger stays down', () => {
        vi.useFakeTimers()
        initRipple()
        const btn = rippleButton()

        // What a browser sends for a touch: pointerdown and touchstart when the
        // finger lands, and a mousedown when it lifts, for pages that only
        // know the mouse.
        const touchstart = Object.assign(new Event('touchstart', { bubbles: true }), { touches: [{ clientX: 1, clientY: 1 }] })
        btn.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
        btn.dispatchEvent(touchstart)
        vi.advanceTimersByTime(300)
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

        expect(btn.querySelectorAll('.ripple').length).toBe(1)
    })
})
