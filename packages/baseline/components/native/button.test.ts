import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
    it('calls click handlers once per click, with the MouseEvent', () => {
        const btn = Button('Save')
        const handler = vi.fn()
        btn.on('click', handler)

        btn.el.click()

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('still calls click handlers on emit("click")', () => {
        const btn = Button('Save')
        const handler = vi.fn()
        btn.on('click', handler)

        btn.emit('click')

        expect(handler).toHaveBeenCalledTimes(1)
    })
})
