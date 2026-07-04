import { Page, Div, router } from "@codesuma/baseline"
import { PageHeader } from '../../../components/page-header'
import { theme } from '../../../theme'

export const InstantPage = () => {
    const page: any = Page()
    const title = PageHeader('Instant')
    const note = Div('This page overrode the default enter animation with page.showInstant() - it appeared with no slide-in transition.')
    note.style({ color: theme.textMuted })
    const back = Div('Back to Transitions')
    back.style({ cursor: 'pointer', textDecoration: 'underline', marginTop: '20px', color: theme.brand })
    back.on('click', () => router.goto('/transitions'))

    // Override the default enter animation, per the README's transition-customization pattern.
    page.off('enter')
    page.on('enter', () => {
        page.showInstant()
    })

    page.append(title, note, back)
    page.style({ background: theme.bg })

    return page
}

export default InstantPage
