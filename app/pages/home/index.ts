import { Page, Div, H1, P } from "../../baseline/index"
import { Card } from '../../components/card'

export const HomePage = () => {
    const page = Page()
    const card = Card()

    page.append(card)


    return page
}