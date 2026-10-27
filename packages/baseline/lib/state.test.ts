import { describe, it, expect, vi } from 'vitest'
import state from './state'

describe('state', () => {
    it('clear() tells each key subscriber its value is gone, like remove()', () => {
        state.set('user', { id: 1 })
        const onUser = vi.fn()
        const onChange = vi.fn()
        state.on('user', onUser)
        state.on('change', onChange)

        state.clear()

        expect(state.get('user')).toBeUndefined()
        expect(onUser).toHaveBeenCalledWith(undefined)
        expect(onChange).toHaveBeenCalledWith({ key: '*', value: undefined })
    })
})
