import { Page, Div } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'

export const AboutPage = () => {
    const page = Page()
    const title = PageHeader('About')

    page.append(title)

    return page
}
