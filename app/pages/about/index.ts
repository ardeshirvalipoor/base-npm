import { Page, Div } from "@codesuma/baseline"
import { PageHeader } from '../shared/page-header'

export const AboutPage = () => {
    const page = Page()
    const title = PageHeader('About')

    page.append(title)

    return page
}
