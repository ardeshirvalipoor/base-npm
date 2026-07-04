import { Page, Div } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { theme } from '../../theme'

export const AboutPage = () => {
    const page = Page()
    const title = PageHeader('About')
    const body = Div('A demo app showcasing every corner of @codesuma/baseline - components, router, transitions, data, events and helpers.')

    body.style({ color: theme.textMuted, lineHeight: '1.5' })
    page.append(title, body)
    page.style({ background: theme.bg })

    return page
}
