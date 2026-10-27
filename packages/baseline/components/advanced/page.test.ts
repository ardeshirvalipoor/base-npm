import { describe, it, expect } from 'vitest'
import { Page } from './page'

describe('Page', () => {
    it('starts its enter animation at once, with no pause after the old page left', () => {
        const page = Page()

        page.emit('enter', { params: {}, query: {}, from: '', isBack: false })

        expect(page.el.getAttribute('aria-hidden')).toBe('false')
        expect(page.el.style.transition).toBe('')
    })
})
