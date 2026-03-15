import { Input, Page } from "@codesuma/baseline"
import { Card } from '../../components/card'

export const HomePage = () => {
    const page = Page()
    // const card = Card()
    const chck = Input('Check me', 'checkbox')
    const text = Input('Enter name...', 'text')

    // chck.toggle()
    // text.select()
    page.append(chck, text)
    page.style({ padding: '116px' })

    // card.append(chck, text)

    return page
}