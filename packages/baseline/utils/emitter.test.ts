import { describe, it, expect, vi } from 'vitest'
import { createEmitter } from './emitter'

const tick = () => new Promise(r => setTimeout(r, 0))

describe('emitter once()', () => {
    it('emitAsync() waits for an async once() handler', async () => {
        const e = createEmitter()
        let done = false
        e.once('exit', async () => {
            await tick()
            done = true
        })

        await e.emitAsync('exit')

        expect(done).toBe(true)
    })

    it('a once() handler that throws still runs only one time', () => {
        const e = createEmitter()
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const handler = vi.fn(() => { throw new Error('boom') })
        e.once('x', handler)

        e.emit('x')
        e.emit('x')
        vi.restoreAllMocks()

        expect(handler).toHaveBeenCalledTimes(1)
    })
})
