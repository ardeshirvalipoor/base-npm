import { Page, Div, router } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { theme } from '../../theme'

export const NotFoundPage = () => {
    const page = Page()
    const title = PageHeader('Not found')
    const msg = Div('No route matched - this is the "*" wildcard fallback page.')
    msg.style({ color: theme.textMuted })
    const home = Div('Go home')
    home.style({ cursor: 'pointer', textDecoration: 'underline', marginTop: '20px', color: theme.brand })
    home.on('click', () => router.goto('/'))

    page.append(title, msg, home)
    page.style({ background: theme.bg })

    return page
}

export default NotFoundPage
