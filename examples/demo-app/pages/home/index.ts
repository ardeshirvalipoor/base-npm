import { Input, Page, Div } from "@codesuma/baseline"
import { Card } from '../../components/card'
import { Heading } from '../../components/heading'
import { theme } from '../../theme'

export const HomePage = () => {
    const page = Page()
    const content = Div()
    const heading = Heading('Baseline Showcase')
    const card = Card()
    const chck = Input('Check me', 'checkbox')
    const text = Input('Enter name...', 'text')

    chck.on('change', ({ value }: any) => card.text(value ? 'Checked!' : 'Card'))
    text.on('enter', ({ value }: any) => card.text(value || 'Card'))

    const form = Div()
    form.style({ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginTop: '24px' })
    form.append(chck, text)

    content.append(heading, card, form)
    content.style({ transition: 'transform 0.2s ease, opacity 0.2s ease' })
    page.append(content)
    page.style({ overflowY: 'auto', background: theme.bg })

    // Extra depth on top of Page()'s own slide: fade + rise the home content as the
    // next page slides up over it, inspired by shared-list's home -> menu transition.
    // Applied to an inner wrapper (not `page` itself) so it doesn't fight Page()'s own
    // transform/opacity transition on the page element.
    page.on('exit', () => {
        content.style({ transform: 'translateY(-24px)', opacity: '0.4' })
    })
    page.on('enter', () => {
        content.style({ transform: 'translateY(0)', opacity: '1' })
    })

    return page
}
