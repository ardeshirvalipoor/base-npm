// Global state with optional change notifications

import { createEmitter } from '../utils/emitter'

const data: Record<string, any> = {}
const emitter = createEmitter()

export const get = <T = any>(key: string): T | undefined => data[key]

export const set = <T>(key: string, value: T): T => {
    data[key] = value
    emitter.emit(key, value)      // Emit specific key
    emitter.emit('change', { key, value })  // Emit generic 'change'
    return value
}

export const remove = (key: string) => {
    delete data[key]
    emitter.emit(key, undefined)
    emitter.emit('change', { key, value: undefined })
}

export const clear = () => {
    const keys = Object.keys(data)
    keys.forEach(k => delete data[k])
    keys.forEach(k => emitter.emit(k, undefined))
    emitter.emit('change', { key: '*', value: undefined })
}

export const all = () => ({ ...data })

// Re-export emitter methods for subscriptions
export const on = emitter.on.bind(emitter)
export const off = emitter.off.bind(emitter)
export const once = emitter.once.bind(emitter)

export default { get, set, remove, clear, all, on, off, once }
