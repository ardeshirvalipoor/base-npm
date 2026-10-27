import { Div, Page } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { MenuItem } from './shared/item'
import { theme } from '../../theme'

export const MenuPage = () => {
    const page = Page()
    const title = PageHeader('Menu')
    const about = MenuItem('About', '/about')
    const components = MenuItem('Components', '/components')
    const forms = MenuItem('Forms', '/forms')
    const routerDemo = MenuItem('Router Demo', '/router-demo')
    const transitions = MenuItem('Transitions', '/transitions')
    const data = MenuItem('Data', '/data')
    const events = MenuItem('Events & Tree Ops', '/events')
    const utilities = MenuItem('Utilities', '/utilities')
    const helpers = MenuItem('Helpers', '/helpers')

    page.append(title, about, components, forms, routerDemo, transitions, data, events, utilities, helpers)
    page.style({ overflowY: 'auto', background: theme.bg })
    return page
}