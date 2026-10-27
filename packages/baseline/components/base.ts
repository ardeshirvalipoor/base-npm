import { nextId } from '../utils/id'
import { createAppender, IAppender } from '../utils/appender'
import { createStyler, IStyler } from '../utils/styler'
import { createContent, IContent } from '../utils/content'
import { createEmitter, IEmitter } from '../utils/emitter'

function proxyDomEvents(component: any, el: Element) {
    const _on = component.on.bind(component)
    const _off = component.off.bind(component)

    const isDomEvent = (event: string) => ('on' + event) in el

    component.on = (event: string | string[], handler: Function) => {
        const events = Array.isArray(event) ? event : [event]
        for (const e of events) {
            if (isDomEvent(e) && !(el as any)['on' + e]) el.addEventListener(e, handler as EventListener)
        }
        return _on(event, handler)
    }

    component.off = (event: string, handler?: Function) => {
        if (handler && isDomEvent(event)) el.removeEventListener(event, handler as EventListener)
        return _off(event, handler)
    }
}

function buildComponent(id: string, el: Element): any {
    el.setAttribute('data-base-id', id)

    const component: any = { id, el, isMounted: false, parent: undefined }

    Object.assign(component, createEmitter(), createAppender(component), createStyler(component), createContent(component))
    proxyDomEvents(component, el)

    return component
}

export function Base<K extends keyof HTMLElementTagNameMap>(name: K = 'div' as K): IBaseComponent<K> {
    return buildComponent(nextId(), document.createElement(name))
}

export function BaseSVG<K extends keyof SVGElementTagNameMap>(name: K = 'svg' as K): IBaseSVGComponent<K> {
    return buildComponent(nextId(), document.createElementNS('http://www.w3.org/2000/svg', name))
}

export interface IBaseComponent<K extends keyof HTMLElementTagNameMap = 'div'> extends IEmitter, IAppender, IStyler, IContent {
    id: string
    el: HTMLElementTagNameMap[K]
    parent?: IBaseComponent<any>
    isMounted: boolean
}

export interface IBaseSVGComponent<K extends keyof SVGElementTagNameMap = 'svg'> extends IEmitter, IAppender, IStyler, IContent {
    id: string
    el: SVGElementTagNameMap[K]
    parent?: IBaseComponent<any> | IBaseSVGComponent<any>
    isMounted: boolean
}