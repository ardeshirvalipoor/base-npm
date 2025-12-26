import { Page } from '@codesuma/baseline'
import { Card } from '../../components/card'

export const HomePage = () => {
    const page = Page()
    const card = Card()

    page.append(card)


    return page
}