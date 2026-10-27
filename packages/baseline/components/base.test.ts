import { describe, it, expect, vi } from 'vitest'
import { Base } from './base'

describe('DOM event proxy', () => {
    it('on() passes the DOM event to the handler', () => {
        const c = Base('div')
        const handler = vi.fn()
        c.on('click', handler)

        c.el.click()

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('off() removes a handler that listens to two DOM events', () => {
        const c = Base('div')
        const handler = vi.fn()
        c.on(['mouseenter', 'focus'], handler)

        c.off('mouseenter', handler)
        c.off('focus', handler)
        c.el.dispatchEvent(new Event('mouseenter'))
        c.el.dispatchEvent(new Event('focus'))

        expect(handler).not.toHaveBeenCalled()
    })

    it('once() on a DOM event fires one time', () => {
        const c = Base('div')
        const handler = vi.fn()
        c.once('click', handler)

        c.el.click()
        c.el.click()

        expect(handler).toHaveBeenCalledTimes(1)
    })
})
