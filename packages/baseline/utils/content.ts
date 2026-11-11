import { IBaseComponent, IBaseSVGComponent } from '../components/base'

type Component = IBaseComponent<any> | IBaseSVGComponent<any>

export function createContent(base: Component): IContent {
    return {
        text(content: string) {
            base.el.textContent = content
            return base
        },

        html(content: string) {
            base.el.innerHTML = content
            return base
        }
    }
}

export interface IContent {
    text(content: string): this
    html(content: string): this
}

export default createContent
