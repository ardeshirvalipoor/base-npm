import { nextId } from '../utils/id'
import { createAppender, IAppender } from '../utils/appender'
import { createStyler, IStyler } from '../utils/styler'
import { createEmitter, IEmitter } from '../utils/emitter'

export function Base<K extends keyof HTMLElementTagNameMap>(name: K = 'div' as K): IBaseComponent<K> {
    const id = nextId()
    const el = document.createElement(name)
    el.setAttribute('data-base-id', id)

    const component: any = { id, el, isMounted: false, parent: undefined }

    Object.assign(component, createEmitter(), createAppender(component), createStyler(component))

    return component
}

export function BaseSVG<K extends keyof SVGElementTagNameMap>(name: K = 'svg' as K): IBaseSVGComponent<K> {
    const id = nextId()
    const el = document.createElementNS('http://www.w3.org/2000/svg', name)
    el.setAttribute('data-base-id', id)

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