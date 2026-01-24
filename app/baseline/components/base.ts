import { nextId } from '../utils/id'
import { createAppender, IAppender } from '../utils/appender'
import { createStyler, IStyler } from '../utils/styler'
import { createEmitter, IEmitter } from '../utils/emitter'
import { initMounter } from '../utils/mounter'

initMounter()

export function Base<K extends keyof HTMLElementTagNameMap>(name: K = 'div' as K): IBaseComponent<K> {
    const id = nextId()
    const el = document.createElement(name)
    el.setAttribute('data-base-id', id)

    try {
        const stack = new Error().stack
        if (stack) {
            const lines = stack.split('\n')
            // V8: Error, at Base, at Caller -> index 2
            // Firefox/Safari: Base@..., Caller@... -> index 1
            const callerLine = lines[0].includes('Error') ? lines[2] : lines[1]
            if (callerLine) {
                const match = callerLine.match(/at\s+([^\s(]+)/) || callerLine.match(/^([^\s@]+)/)
                if (match?.[1]) {
                    el.setAttribute('data-component-name', match[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
                }
            }
        }
    } catch (e) {
        // Ignore stack trace errors
    }

    const component: any = { id, el, isMounted: false, parent: undefined }

    Object.assign(component, createEmitter(), createAppender(component), createStyler(component))

    return component
}

export function BaseSVG<K extends keyof SVGElementTagNameMap>(name: K = 'svg' as K): IBaseSVGComponent<K> {
    const id = nextId()
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)
    el.setAttribute('data-base-id', id)

    try {
        const stack = new Error().stack
        if (stack) {
            const lines = stack.split('\n')
            const callerLine = lines[0].includes('Error') ? lines[2] : lines[1]
            if (callerLine) {
                const match = callerLine.match(/at\s+([^\s(]+)/) || callerLine.match(/^([^\s@]+)/)
                if (match?.[1]) {
                    el.setAttribute('data-component-name', match[1].replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
                }
            }
        }
    } catch (e) {
        // Ignore stack trace errors
    }

    const component: any = { id, el, isMounted: false, parent: undefined }

    Object.assign(component, createEmitter(), createAppender(component), createStyler(component))

    return component
}

export interface IBaseComponent<K extends keyof HTMLElementTagNameMap = 'div'> extends IEmitter, IAppender, IStyler {
    id: string
    el: HTMLElementTagNameMap[K]
    parent?: IBaseComponent<any>
    isMounted: boolean
}

export interface IBaseSVGComponent<K extends keyof SVGElementTagNameMap = 'svg'> extends IEmitter, IAppender, IStyler {
    id: string
    el: SVGElementTagNameMap[K]
    parent?: IBaseComponent<any> | IBaseSVGComponent<any>
    isMounted: boolean
}