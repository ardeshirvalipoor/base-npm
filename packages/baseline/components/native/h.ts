import { Base } from '../base'

const createHeading = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', content = '') => {
    const base = Base(tag)
    if (content) base.el.textContent = content

    return base
}

export const H1 = (content = '') => createHeading('h1', content)
export const H2 = (content = '') => createHeading('h2', content)
export const H3 = (content = '') => createHeading('h3', content)
export const H4 = (content = '') => createHeading('h4', content)
export const H5 = (content = '') => createHeading('h5', content)
export const H6 = (content = '') => createHeading('h6', content)
