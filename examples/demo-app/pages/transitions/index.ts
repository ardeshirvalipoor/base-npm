import { Page, Div, Button, router } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { theme } from '../../theme'

export const TransitionsPage = () => {
    const page: any = Page()
    const title = PageHeader('Transitions')

    const info = Section('Default transition')
    info.add(Div('This page uses the default directional slide enter/exit animation from Page().'))

    const instant = Section('showInstant() override')
    const instantLink = Div('Go to Instant page')
    instantLink.style({ padding: '8px 12px', border: `1px solid ${theme.border}`, borderRadius: theme.radiusSm, cursor: 'pointer', display: 'inline-block', background: theme.surface })
    instantLink.on('click', () => router.goto('/transitions/instant'))
    instant.add(instantLink, Div('That page overrides page.on(\'enter\') with page.showInstant() - no slide-in animation.'))

    const exitSection = Section('exitDown()')
    const exitBtn = Button('page.exitDown(), then go home')
    exitBtn.on('click', async () => {
        await page.exitDown()
        router.goto('/')
    })
    exitSection.add(exitBtn)

    page.append(title, info, instant, exitSection)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default TransitionsPage
