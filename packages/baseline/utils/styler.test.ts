import { describe, it, expect } from 'vitest'
import { Base } from '../components/base'

describe('styler', () => {
    it('style() sets a custom property next to a normal one', () => {
        const c = Base('div')

        c.style({ '--accent': 'red', color: 'blue' })

        expect(c.el.style.getPropertyValue('--accent')).toBe('red')
        expect(c.el.style.color).toBe('blue')
    })

    it('style() leaves a custom property alone when its value is undefined', () => {
        // As with a normal property: style({ color: undefined }) changes nothing.
        const c = Base('div')
        c.style({ '--accent': 'red' })

        c.style({ '--accent': undefined })
        expect(c.el.style.getPropertyValue('--accent')).toBe('red')

        c.style({ '--accent': null })
        expect(c.el.style.getPropertyValue('--accent')).toBe('')
    })

    it('attr() with null removes the attribute', () => {
        const c = Base('div')
        c.attr('title', 'Hello')
        expect(c.attr('title')).toBe('Hello')

        c.attr('title', null)

        expect(c.el.hasAttribute('title')).toBe(false)
    })

    it('addClass() and removeClass() skip empty and false values', () => {
        const c = Base('div')

        c.addClass('a', '', false, null, undefined, 'b')
        expect(c.el.className).toBe('a b')

        c.removeClass('', false, 'a')
        expect(c.el.className).toBe('b')
    })
})
