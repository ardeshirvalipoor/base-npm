export function createEmitter<T extends Record<string, any> = Record<string, any>>(): IEmitter<T> {
    const listeners: Record<string, Function[]> = {}

    return {
        on(event, handler) {
            const events = Array.isArray(event) ? event : [event]
            for (const e of events) {
                const key = e as string
                listeners[key] = listeners[key] || []
                listeners[key].push(handler)
            }
            return this
        },

        once(event, handler) {
            const wrapper = (payload: any) => {
                handler(payload)
                this.off(event, wrapper as any)
            }
            return this.on(event, wrapper as any)
        },

        off(event, handler) {
            const key = event as string
            if (!handler) {
                delete listeners[key]
            } else if (listeners[key]) {
                listeners[key] = listeners[key].filter(h => h !== handler)
            }
            return this
        },

        emit(event, payload) {
            const key = event as string
            if (listeners[key]) {
                for (const handler of listeners[key]) {
                    handler(payload)
                }
            }
            return this
        },

        removeAllListeners() {
            for (const key in listeners) delete listeners[key]
        },

        getListeners() {
            return listeners
        }
    } as IEmitter<T>
}

// Global emitter for framework internals (mounter, theme, db-ready)
export const emitter = createEmitter()

export interface IEmitter<T extends Record<string, any> = Record<string, any>> {
    on<K extends keyof T>(event: K | K[], handler: (payload: T[K]) => void): this
    once<K extends keyof T>(event: K, handler: (payload: T[K]) => void): this
    off<K extends keyof T>(event: K, handler?: (payload: T[K]) => void): this
    emit<K extends keyof T>(event: K, payload?: T[K]): this
    removeAllListeners(): void
    getListeners(): Record<string, Function[]>
}
