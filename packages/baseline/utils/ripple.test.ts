import { describe, it, expect } from 'vitest'
import { initRipple } from './ripple'

describe('initRipple', () => {
    it('shows one ripple per press when called more than once', () => {
        initRipple()
        initRipple()
        const btn = document.createElement('button')
        btn.setAttribute('data-ripple', '')
        document.body.appendChild(btn)

        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))

        expect(btn.querySelectorAll('.ripple').length).toBe(1)
    })
})
